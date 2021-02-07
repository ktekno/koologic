"use strict"

const redis = require('redis');
const JWTR =  require('jwt-redis').default;
const redisClient = redis.createClient();
const jwtr = new JWTR(redisClient);

async function checkToken(req, res) {

    return new Promise((resolve, reject) => {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (token) {
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            }
            jwtr.verify(token, JSON.parse(process.env.ADMIN_CRED).token).then(result =>{
                resolve("OK");
            }).catch(function(err){
                if (err) {
                    res.status(403).send('Auth error');
                }
            })
        } else {
            res.status(403).send('Auth token is not supplied');
        }
    });
}


module.exports = { redis, JWTR, redisClient, jwtr, checkToken }