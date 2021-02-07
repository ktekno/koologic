"use strict"

const fs = require('fs');
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
//const nforce = require('nforce');
const RedisServer = require('redis-server');

const env = 
        fs.existsSync('./config/config.prod.json')? "prod" : 
        "local";
var config 
var envConfig

try {
    if (env === 'production' || env === 'prod'){
        config = require('./config.prod.json');
    } else {
        config = require('./config.json');
    }
    
    envConfig = config[env];
    Object.keys(envConfig).forEach((key) => {
         process.env[key] = ((typeof envConfig[key] === 'object')? JSON.stringify(envConfig[key]) : envConfig[key]);
    });
    const server = new RedisServer(6379);
 
    server.open((err) => {
        if (err === null) {
        }
    });

 
} catch(e) {
    console.log(e);
    
    console.log('Error: Could not find configuration file. Please create config.json file, base it from config.json.example');
    process.exit(1);
}

const wooApi = new WooCommerceRestApi(JSON.parse(process.env.WC_CREDS));
//const salesforce = nforce.createConnection(JSON.parse(process.env.SALESFORCE_KEYS));
module.exports = { config, env, wooApi };