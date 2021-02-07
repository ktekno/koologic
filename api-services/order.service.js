const express = require("express");
const { wooApi } = require("../config/config"); 
const Cryptr = require('cryptr');
const cryptr = new Cryptr(JSON.parse(process.env.ADMIN_CRED).token);
const nodemailer = require("nodemailer");


const orderApi = express.Router();


orderApi.get("/order/:id", async function(req, res){
    try{
        let orderInfo = (await wooApi.get("orders/" + req.params.id)).data;
        let products = (await wooApi.get("products?include=" + orderInfo.line_items.map(e => e.product_id).join(",") + "&_fields=id,slug,images,sale_price,regular_price")).data 
        orderInfo.line_items.forEach(function(line_item, index){
            let prod_index = products.findIndex(r => r.id == line_item.product_id);
            orderInfo.line_items[index].slug = products[prod_index].slug;
            orderInfo.line_items[index].images = products[prod_index].images;
            orderInfo.line_items[index].regular_price = products[prod_index].regular_price;
            orderInfo.line_items[index].sale_price = products[prod_index].sale_price;
        });
        if(orderInfo.customer_id == cryptr.decrypt(req.cookies.user_id)){
            res.status(200).send({
                success: true,
                order_detail: orderInfo
            });
        } else {
            res.status(403).send("Not authorized")
        }
    } catch (e){
        console.log(e);
        res.status(400).send("Order fetch failed")
    }
});


orderApi.get("/order-list/:page", async function(req, res){
    try{
        let orderList = (await wooApi.get("orders?customer=" + cryptr.decrypt(req.cookies.user_id) + "&page=" + req.params.page + "&per_page=5&filter[orderby]=date&order=asc"));
        if(orderList.data.length > 0 && orderList.data[0].customer_id == cryptr.decrypt(req.cookies.user_id)){
            res.status(200).send({
                success: true,
                order_detail: orderList.data,
                total_orders: orderList.headers["x-wp-total"],
                total_pages: orderList.headers["x-wp-totalpages"]
            });
        } else {
            res.status(403).send("Not authorized")
        }
    } catch (e){
        console.log(e);
        res.status(400).send("Order fetch failed")
    }
});

orderApi.post("/order/new", async function(req, res){
    try{
        let customerInfo = (await wooApi.get("customers/" +cryptr.decrypt(req.cookies.user_id))).data;
        let total_price = JSON.parse(req.cookies.cart_contents).reduce(function(prev, cur) {return parseFloat(prev) + parseFloat(cur.priceBadge);}, 0)
        let customerMetaIndex = customerInfo.meta_data.findIndex(r => r.key == "points");
        req.body.customer_id = cryptr.decrypt(req.cookies.user_id);
        req.body.billing.first_name = customerInfo.first_name;
        req.body.billing.last_name = customerInfo.last_name;
        req.body.billing.email = customerInfo.email;
        req.body.billing.phone = customerInfo.billing.phone;
        req.body.shipping.first_name = customerInfo.first_name;
        req.body.shipping.last_name = customerInfo.last_name;
        req.body.shipping.email = customerInfo.email;
        req.body.shipping.phone = customerInfo.billing.phone;
        if(req.cookies.points){
            (await wooApi.put("customers/" + cryptr.decrypt(req.cookies.user_id), {
                meta_data: [{
                    key: "points",
                    value: parseFloat(customerMetaIndex > -1? customerInfo.meta_data[customerMetaIndex].value: 0) - parseFloat(req.cookies.points) + parseFloat(total_price)/1000.00
                }]
            }))
            req.body.coupon_lines = [{
                code: "KL" + parseFloat(req.cookies.points)
            }]
        }
        res.clearCookie('cart_contents');
        res.clearCookie('points');
        res.status(200).send({
            success: true,
            order_id: (await wooApi.post("orders", req.body)).data.id
        });
    } catch (e){
        console.log(e);
        res.status(400).send("Order creation failed")
    }
});

orderApi.get("/order/complete/:order_id", async function(req, res){
    try{
        res.status(200).send({
            success: true,
            order_info: (await wooApi.put("orders/" + req.params.order_id, {
                set_paid: true,
                status: 'completed'
            })).data
        });
    } catch (e){
        console.log(e);
        res.status(400).send("Order modification failed")
    }
});

orderApi.get("/order/cancel/:order_id", async function(req, res){
    try{
        res.status(200).send({
            success: true,
            order_info: (await wooApi.put("orders/" + req.params.order_id, {
                status: 'cancelled'
            })).data
        });
    } catch (e){
        console.log(e);
        res.status(400).send("Order modification failed")
    }
});

orderApi.get("/order/refund/:order_id", async function(req, res){
    try{
        res.status(200).send({
            success: true,
            order_info: (await wooApi.put("orders/" + req.params.order_id, {
                status: 'refund'
            })).data
        });
    } catch (e){
        console.log(e);
        res.status(400).send("Order modification failed")
    }
});
module.exports = orderApi;