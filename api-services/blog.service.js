"use strict"

const express = require("express");
const fetch = require('node-fetch');

const blogApi = express.Router();

blogApi.get("/posts/:category/:page", async function(req, res){
    try{
        let domain = JSON.parse(process.env.MISC).wordpress_url;
        let category = (await (await fetch(domain + '/wp/v2/categories?slug=' + req.params.category)).json())[0].id;
        let post_info = (await fetch(domain + '/wp/v2/posts?categories=' + category + "&page=" + req.params.page + "&per_page=5"));
        let total_pages = post_info.headers.raw()['x-wp-totalpages'];
        let post_list = await post_info.json();
        for(let i = 0; i < post_list.length; i++){
            post_list[i].media = (await (await fetch(domain + '/wp/v2/media/'+ post_list[i].featured_media)).json()).source_url;
        }
        res.status(200).send({
            post_list: post_list,
            total_page: parseInt(total_pages[0])
        });
    } catch(e){
        res.status(400).send(e);
    }
});

blogApi.get("/post/:slug", async function(req, res){
    try{
        let domain = JSON.parse(process.env.MISC).wordpress_url;
        let post_content = await (await fetch(domain + '/wp/v2/posts?slug=' + req.params.slug)).json();

        res.status(200).send({
            post_content: post_content
        });
    } catch(e){
        res.status(400).send(e);
    }
});

module.exports = blogApi;