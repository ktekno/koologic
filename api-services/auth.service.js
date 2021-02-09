"use strict"

const express = require("express");
const { wooApi } = require("../config/config");
const { redis, JWTR, redisClient, jwtr, checkToken, sessionstorage } = require('../helpers/authenticator.helper');
const { PasswordHash } = require('node-phpass');
const mysql = require('mysql');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(JSON.parse(process.env.ADMIN_CRED).token);
const nodemailer = require("nodemailer");
const cryptoRandomString = require('crypto-random-string');

const authApi = express.Router();
const hasher = new PasswordHash(8, true, 7);

authApi.post("/auth", async function(req, res){
    
    let connection = mysql.createConnection(JSON.parse(process.env.DB));
    connection.connect();
    connection.query(`SELECT id, user_pass FROM wp_users WHERE user_email = "` + req.body.username + `"`, function (error, results, fields) {
        if (error) throw error;
        if(results.length > 0){
            try{
                if(hasher.CheckPassword(req.body.password, results[0].user_pass)) {
                    jwtr.sign({
                        jti: req.body.username
                    }, JSON.parse(process.env.ADMIN_CRED).token, { expiresIn: "8h"} ).then((token) => {
                        jwtr.verify(token, JSON.parse(process.env.ADMIN_CRED).token).then(async result =>{
                            connection = mysql.createConnection(JSON.parse(process.env.DB));
                            connection.connect();
                            connection.query(`SELECT * FROM wp_cart WHERE user_id = "` + results[0].id + `"`, function (error, cart_results, fields) {
                                if(error){
                                    console.log(error,"-");
                                } else {
                                    let cart_contents = typeof req.cookies.cart_contents === "undefined"? [] : JSON.parse(req.cookies.cart_contents);
                                    let count = 0;
                                    cart_contents.forEach(function(cart_content){
                                        let current_prod_index = cart_results.findIndex(r => r.prod_id == cart_content.prod_id);
                                        if(current_prod_index > -1){
                                            cart_results[current_prod_index].quantity = (parseInt(cart_content.quantity) + parseInt(cart_results[current_prod_index].quantity));
                                            cart_results[current_prod_index].priceBadge = (parseFloat(cart_results[current_prod_index].quantity)*parseFloat(cart_results[current_prod_index].discountedPrice != ""? cart_results[current_prod_index].discountedPrice : cart_results[current_prod_index].regularPrice)).toFixed(2);
                                            connection = mysql.createConnection(JSON.parse(process.env.DB));
                                            connection.connect();
                                            connection.query('UPDATE wp_cart SET quantity = ' + cart_contents[current_prod_index].quantity + ', priceBadge = ' + cart_contents[current_prod_index].priceBadge + ' WHERE user_id = ' + results[0].id + ' AND prod_id = ' + cart_content.prod_id, function (error, new_cart_results, fields) {
                                                count++;
                                                if(error){
                                                    console.log(error,"--");
                                                    return;
                                                }
                                                if(count == cart_contents.length){
                                                    res.status(200).send({
                                                        success: true,
                                                        message: "Auth Success!",
                                                        token: token,
                                                        user_id: cryptr.encrypt(results[0].id),
                                                        cart_contents: cart_results
                                                    });
                                                }
                                            });
                                        } else {
                                            connection = mysql.createConnection(JSON.parse(process.env.DB));
                                            connection.connect();
                                            connection.query('INSERT INTO wp_cart (user_id, prod_id, quantity, itemClassificationBadge, itemClassification, imgSrc, regularPrice, discountedPrice, priceBadge, titleSpecs, subSpecs, url) VALUES (' + results[0].id + ', ' + cart_content.prod_id + ', ' + cart_content.quantity + ', "' + cart_content.itemClassificationBadge + '", "' + cart_content.itemClassification + '", "' + cart_content.imgSrc + '", ' + cart_content.regularPrice + ', ' + cart_content.discountedPrice + ', "' + cart_content.priceBadge + '", "' + cart_content.titleSpecs + '", "' + cart_content.subSpecs +'", "' + cart_content.url + '")', function (error, new_cart_results, fields) {
                                                count++;
                                                if(error){
                                                    console.log(error,"---");
                                                    return;
                                                }
                                                cart_results.push(cart_content);
                                                if(count == cart_contents.length){
                                                    res.cookie('cart_contents', JSON.stringify(cart_contents));
                                                    res.status(200).send({
                                                        success: true,
                                                        message: "Auth Success!",
                                                        token: token,
                                                        user_id: cryptr.encrypt(results[0].id),
                                                        cart_contents: cart_results
                                                    });
                                                }
                                            });
                                        }
                                    });
                                    if(cart_contents.length == 0){
                                        res.status(200).send({
                                            success: true,
                                            message: "Auth Success!",
                                            token: token,
                                            user_id: cryptr.encrypt(results[0].id),
                                            cart_contents: cart_results
                                        });
                                    }
                                }
                            });
                        }).catch((error) => {
                            console.log(error,"----");
                            res.status(403).send({
                                success: false,
                                message: "Auth Error!"
                            });
                        });
                    })
                } else {
                    res.status(403).send({
                        success: false,
                        message: "Auth Error!"
                    });
                }
            } catch(e){
                res.status(403).send({
                    success: false,
                    message: "Auth Error!"
                });
            }
        } else {
            res.status(403).send({
                success: false,
                message: "Auth Error!"
            });
        }
        connection.end();
    });
});

authApi.post('/auth/new', async function (req, res) {
    try{
        let response = await wooApi.post("customers", req.body);
        res.status(200).send(response.data);
    } catch(e){
        res.status(500).send(e);
    }
})

authApi.put('/auth/edit', async function (req, res) {
    try{
        if(cryptr.decrypt(req.cookies.user_id)){
            if(req.body.first_name == "" || !req.body.first_name)
                delete req.body.first_name 
            if(req.body.last_name == "" || !req.body.last_name)
                delete req.body.last_name 
            if(req.body.email == "" || !req.body.email)
                delete req.body.last_name 
            if(req.body.billing.phone == "" || !req.body.billing.phone)
                delete req.body.phone 
            let response = await wooApi.put("customers/" + cryptr.decrypt(req.cookies.user_id), req.body);
            res.status(200).send(response.data);
        } else {
            checkToken(req, res).then(result =>{
                res.status(200).send({
                    success: result == "OK"
                });
            }).catch(e =>{
                res.status(403).send({
                    success: false,
                    message: "Auth Error!"
                });
            });
        }
    } catch(e){
        console.log(e);
        res.status(500).send(e);
    }
});

authApi.get('/auth/user-info', async function (req, res) {
    try{
        if(cryptr.decrypt(req.cookies.user_id)){
            let response = await wooApi.get("customers/" + cryptr.decrypt(req.cookies.user_id));
            res.status(200).send(response.data);
        } else {
            checkToken(req, res).then(result =>{
                res.status(200).send({
                    success: result == "OK"
                });
            }).catch(e =>{
                res.status(403).send({
                    success: false,
                    message: "Auth Error!"
                });
            });
        }
    } catch(e){
        res.status(500).send(e);
    }
});

authApi.post('/auth/expire', async function (req, res) {
    try {
        
        let token = req.headers.authorization.slice(7, req.headers.authorization.length)
        let tokenDetails = await jwtr.verify(token, JSON.parse(process.env.ADMIN_CRED).token)
        await jwtr.destroy(tokenDetails.jti);
        res.clearCookie('cart_contents');
        return({
            success: true,
            message: "User logged out"
        });
    } catch(err){
        console.log(err)
        return({
            success: false,
            message: "Invalid Token"
        });
    }
});

authApi.post('/auth/isAuthenticated', async function (req, res) {
    try{
        checkToken(req, res).then(result =>{
            res.status(200).send({
                success: result == "OK"
            });
        }).catch(e =>{
            res.status(403).send({
                success: false,
                message: "Auth Error!"
            });
        });
    } catch(e){
        res.status(500).send(e);
    }
});


authApi.post('/verify-email', async function (req, res) {
    try{
        // let transporter = nodemailer.createTransport({
        //     host: "127.0.0.1",
        //     port: 1025,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //       user: "kdvsolis@protonmail.com", 
        //       pass: "`1Kgaiden`"
        //     }, 
        //     tls: {
        //         rejectUnauthorized: false
        //     }
        //   });
    
        // let info = await transporter.sendMail({
        //   from: '"Me" <johnnycash@protonmail.com>',
        //   to: "wixevab330@200cai.com",
        //   subject: "Hello!",
        //   text: "Hello world?",
        //   html: "<b>Hello world?</b>"
        // });
        let customer = await wooApi.get("customers?email=" + req.body.email);
        if(customer.data.length == 1){
            let temp_password = cryptoRandomString({length: 10, type: 'base64'});console.log(temp_password);
            await wooApi.put("customers/" + customer.data[0].id, {password: temp_password});
            res.status(200).send({ success: true });
        } else {
            
            res.status(200).send({ success: false});
        }

    } catch(e){
        res.status(500).send(e);
    }
});
module.exports = authApi;