const express = require("express");
const mysql = require('mysql');
const fetch = require('node-fetch');
const { wooApi } = require("../config/config"); 
const Cryptr = require('cryptr');
const cryptr = new Cryptr(JSON.parse(process.env.ADMIN_CRED).token);


const cartApi = express.Router();

cartApi.get("/cart/check-points", async function(req, res){

    if(cryptr.decrypt(req.cookies.user_id)){
        let customer_meta = await wooApi.get("customers/" + cryptr.decrypt(req.cookies.user_id) + "?_fields=meta_data");
        let customer_meta_points_index = customer_meta.data.meta_data.findIndex(r => r.key == "points")
        let customer_points = customer_meta_points_index > -1? customer_meta.data.meta_data[customer_meta_points_index].value : 0
        res.status(200).send({
            success: true,
            points: parseFloat(customer_points)
        });
    } else {
        res.status(403).send({
            success: false,
            message: "Unauthorized"
        });
    }
});

cartApi.post("/cart/compute-sf/:courier", async function(req, res){
    
    let post_content = {};
    if(req.params.courier == "mr_speedy"){
        post_content = await (await fetch(JSON.parse(process.env.MR_SPEEDY).url + 'calculate-order', {
            method: 'POST',
            body:    JSON.stringify(req.body),
            headers: { 
                'Content-Type': 'application/json',
                'X-DV-Auth-Token': JSON.parse(process.env.MR_SPEEDY).api_key,
            },
        })).json();
    }
    res.status(200).send(post_content);
});

cartApi.put("/cart/update", async function(req, res){

    let connection = mysql.createConnection(JSON.parse(process.env.DB));
    let cart_content = req.body;
    if(cryptr.decrypt(req.cookies.user_id)){
        let user_id = cryptr.decrypt(req.cookies.user_id);
        connection.query(`SELECT * FROM wp_cart WHERE user_id = "` + cryptr.decrypt(req.cookies.user_id) + `" AND prod_id = ` + req.body.prod_id, function (error, cart_results, fields) {
            let current_prod_index = cart_results.findIndex(r => r.prod_id == cart_content.prod_id);
            if(current_prod_index > -1){
                connection = mysql.createConnection(JSON.parse(process.env.DB));
                connection.connect();
                connection.query('UPDATE wp_cart SET quantity = ' + parseInt(cart_content.quantity) + ', priceBadge = ' + cart_content.priceBadge + ' WHERE user_id = ' + user_id + ' AND prod_id = ' + cart_content.prod_id, function (error, new_cart_results, fields) {
                    if(error){
                        res.status(403).send({
                            success: false,
                            message: "Unauthorized"
                        });
                        return;
                    }
                    res.status(200).send({
                        success: true,
                        message: new_cart_results
                    });
                });
            } else {
                connection = mysql.createConnection(JSON.parse(process.env.DB));
                connection.connect();
                connection.query('INSERT INTO wp_cart (user_id, prod_id, quantity, itemClassificationBadge, itemClassification, imgSrc, regularPrice, discountedPrice, priceBadge, weight, titleSpecs, subSpecs, url) VALUES (' + user_id + ', ' + cart_content.prod_id + ', ' + cart_content.quantity + ', "' + cart_content.itemClassificationBadge + '", "' + cart_content.itemClassification + '", "' + cart_content.imgSrc + '", ' + cart_content.regularPrice + ', ' + cart_content.discountedPrice + ', ' + cart_content.priceBadge + ', "' + cart_content.weight + ', "' + cart_content.titleSpecs + '", "' + cart_content.subSpecs +'", "' + cart_content.url + '")', function (error, new_cart_results, fields) {
                    if(error){
                        res.status(403).send({
                            success: false,
                            message: "Unauthorized"
                        });
                        return;
                    }
                    res.status(200).send({
                        success: true,
                        message: new_cart_results
                    });
                });
            }
            connection.end();
        });
    } else {
        res.status(403).send({
            success: false,
            message: "Unauthorized"
        });
    }
});

cartApi.delete("/cart/clear", async function(req, res){

    let connection = mysql.createConnection(JSON.parse(process.env.DB));
    if(cryptr.decrypt(req.cookies.user_id)){
        connection = mysql.createConnection(JSON.parse(process.env.DB));
        connection.connect();
        connection.query('DELETE FROM wp_cart WHERE user_id = ' + cryptr.decrypt(req.cookies.user_id), function (error, new_cart_results, fields) {
            if(error){
                res.status(403).send({
                    success: false,
                    message: "Unauthorized"
                });
                return;
            } else {
                res.status(200).send({
                    success: true
                });
            }
        });
    } else {
        res.status(403).send({
            success: false,
            message: "Unauthorized"
        });
    }
});

cartApi.delete("/cart/:prod_id", async function(req, res){

    let connection = mysql.createConnection(JSON.parse(process.env.DB));
    if(cryptr.decrypt(req.cookies.user_id)){
        connection = mysql.createConnection(JSON.parse(process.env.DB));
        connection.connect();
        connection.query('DELETE FROM wp_cart WHERE user_id = ' + cryptr.decrypt(req.cookies.user_id) + ' AND prod_id = ' + req.params.prod_id, function (error, new_cart_results, fields) {
            if(error){
                res.status(500).send({
                    success: false,
                    message: "Server error"
                });
                return;
            } else {
                res.status(200).send({
                    success: true
                });
            }
        });
    } else {
        res.status(403).send({
            success: false,
            message: "Unauthorized"
        });
    }
});

module.exports = cartApi;