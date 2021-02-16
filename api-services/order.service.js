const express = require("express");
const { wooApi } = require("../config/config"); 
const fetch = require('node-fetch');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(JSON.parse(process.env.ADMIN_CRED).token);
const nodemailer = require("nodemailer");


const orderApi = express.Router();


orderApi.get("/order/:id", async function(req, res){
    try{
        let orderInfo = (await wooApi.get("orders/" + req.params.id)).data;
        let products = (await wooApi.get("products?include=" + orderInfo.line_items.map(e => e.product_id).join(",") + "&_fields=id,slug,images,sale_price,regular_price")).data;
        let shipment_tracking_index = orderInfo.meta_data.findIndex(r => r.key == "shipment_tracking");
        let shipment_tracking = shipment_tracking_index > -1? orderInfo.meta_data[shipment_tracking_index].value : '';
        if(orderInfo.shipping_lines[0].method_title == "mr_speedy"){
            orderInfo.shipping_info =  await (await fetch(JSON.parse(process.env.MR_SPEEDY).url + 'orders?order_id='+shipment_tracking, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-DV-Auth-Token': JSON.parse(process.env.MR_SPEEDY).api_key,
                }
            })).json(); 
        }
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
        let delivery_info = {};
        let order_id = {};
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
        order_id = (await wooApi.post("orders", req.body)).data.id;
        if(req.body.shipping_lines[0].method_title == "mr_speedy"){
            delivery_info = await (await fetch(JSON.parse(process.env.MR_SPEEDY).url + 'create-order', {
                method: 'POST',
                body:    JSON.stringify({
                    matter:"Gadgets",
                    is_client_notification_enabled: true,
                    is_route_optimizer_enabled: true,
                    vehicle_type_id: 8,
                    total_weight_kg: req.body.meta_data[req.body.meta_data.findIndex(r => r.key == "weight")].value,
                    points:[{
                       address:"70 Jasmine, St. Lodora Village, Brgy Tunasan, Muntinlupa, NCR",
                        contact_person: { 
                            name: "Kydo Solis",
                            phone: "09054302834"
                        },
                        client_order_id: order_id
                    },{
                        address: req.body.shipping.address_1 + ", " + req.body.shipping.city + ", " + req.body.shipping.state,
                        contact_person: { 
                            name: req.body.shipping.first_name + " " + req.body.shipping.last_name,
                            phone: req.body.shipping.phone
                        },
                        client_order_id: order_id
                    }]
                }),
                headers: { 
                    'Content-Type': 'application/json',
                    'X-DV-Auth-Token': JSON.parse(process.env.MR_SPEEDY).api_key,
                },
                credentials: "include"
            })).json();
            order_id = (await wooApi.put("orders/" + order_id, {
                meta_data: [{
                    key: "shipment_tracking",
                    value:  delivery_info.order.order_id
                }]
            })).data.id;
            order_id = order_id;
        }
        res.clearCookie('cart_contents');
        res.clearCookie('points');
        res.status(200).send({
            success: true,
            order_id: order_id
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