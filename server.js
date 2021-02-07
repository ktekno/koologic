const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const apiPaths = './api-services/'
const fetch = require('node-fetch');
var cookieParser = require('cookie-parser')
//const Cryptr = require('cryptr');
//const cryptr = new Cryptr(JSON.parse(process.env.ADMIN_CRED).token);

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views/dist/koologic'));

fs.readdirSync(apiPaths).forEach(function(file) {
    try{
        app.use(require(apiPaths + file));
    } catch(err){
        console.log(file,"----err", err);
    }
});


app.get('/*', function(req,res){
    res.sendFile(path.join(__dirname, '/views/dist/koologic', 'index.html'))
});

app.listen(parseInt(process.env.port) || 8080);