const express = require("express");
const { wooApi } = require("../config/config"); 


const productApi = express.Router();

productApi.get("/product-info/:slug", async function(req, res){
    try{
        let productInfo = await wooApi.get("products?slug=" + req.params.slug);
        if(productInfo.data[0].variations.length > 0){
            let variations = productInfo.data[0].variations;
            let attributes = productInfo.data[0].attributes;
            let images = productInfo.data[0].images;
            let description = productInfo.data[0].description;
            let short_description = productInfo.data[0].short_description;
            productInfo.data[0] = (await wooApi.get("products/" + (productInfo.data[0].variations[0]))).data;
            productInfo.data[0].description = description
            productInfo.data[0].short_description = short_description;
            productInfo.data[0].variations = variations;
            productInfo.data[0].attributes = attributes;
            productInfo.data[0].images = images;
        }
        res.status(200).send(productInfo.data[0]);
    } catch (e){
        res.status(400).send("Product not found")
    }
});

productApi.get("/product-info-by-id/:id", async function(req, res){
    try{
        let productInfo = await wooApi.get("products/" + req.params.id);
        res.status(200).send(productInfo.data);
    } catch (e){
        res.status(400).send("Product not found")
    }
});

productApi.get("/products-new/:days_ago", async function(req, res){
    try{
        let productInfo = await wooApi.get("products?per_page=99&orderby=date&order=desc&before=" + new Date().toISOString() + "&after=" + new Date(new Date().setDate(new Date().getDate() - parseInt(req.params.days_ago))).toISOString());
        res.status(200).send(productInfo.data);
    } catch (e){
        res.status(400).send("Product not found")
    }
});

productApi.get("/products-best-seller", async function(req, res){
    try{
        let productTags = (await wooApi.get("products/categories")).data;
        let productTagIdIndex = productTags.findIndex(r => r.slug == "best-seller");
        let productTagId = productTagIdIndex > -1? productTags[productTagIdIndex].id : 0;
        let productInfo = (await wooApi.get("products?category="+productTagId)).data;
        console.log(productInfo);
        res.status(200).send(productInfo);
    } catch (e){
        console.log(e);
        res.status(400).send("Product not found")
    }
});

productApi.get("/product-search/:keyword", async function(req, res){
    try{
        let productInfo = (await wooApi.get("products?per_page=99")).data;
        let searchResult = [];
        productInfo.forEach(function(product){
            req.params.keyword.split(" ").forEach(function(keyword){
                if(product.name.toLowerCase().includes(keyword.toLowerCase()) && searchResult.findIndex(r => r.name.includes(product.name)) == -1){
                    if((parseFloat(product.regular_price) || 0) > 0){
                        product.save_percent = (((parseFloat(product.regular_price) || 0) - (parseFloat(product.sale_price) || 0))*100/(parseFloat(product.regular_price))).toFixed(2);
                    } else {
                        product.save_percent = 0;
                    }
                    searchResult.push(product);
                }
            })
        })
        res.status(200).send(searchResult);
    } catch (e){
        console.log(e);
        res.status(400).send("Product not found")
    }
});


productApi.get("/product-category/:category", async function(req, res){
    try{
        let productTags = (await wooApi.get("products/tags")).data;
        let productTagIdIndex = productTags.findIndex(r => r.slug == req.params.category);
        let productTagId = productTags[productTagIdIndex].id;
        let description = productTags[productTagIdIndex].description;
        let productInfo = (await wooApi.get("products?tag="+productTagId)).data;
        let productList = [];
        productInfo.forEach(function(product){
            if((parseFloat(product.regular_price) || 0) > 0){
                product.save_percent = (((parseFloat(product.regular_price) || 0) - (parseFloat(product.sale_price) || 0))*100/(parseFloat(product.regular_price))).toFixed(2);
            } else {
                product.save_percent = 0;
            }
            product.category_name = description;
            productList.push(product);
        })
        res.status(200).send(productList);
    } catch (e){
        console.log(e);
        res.status(400).send("Product not found")
    }
});
module.exports = productApi;