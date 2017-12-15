'use strict';
var CONFIG = require("./config.json");
process.env.CONFIG = JSON.stringify(CONFIG);

var http = require('http');
var express = require("express");

// init server
var app = express();
var server = http.createServer(app);
// init defalut route
var defaultRoute = require("./app/routes/default_route.js");

server.listen(CONFIG.port, function () {
    var host = this.address().address;
    var port = this.address().port;

    console.log('App listening at http://%s:%s', host, port);
});

app.use(defaultRoute);