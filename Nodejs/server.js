'use strict';
var CONFIG = require("./config.json");
process.env.CONFIG = JSON.stringify(CONFIG);

var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); 
const passport = require('passport');

// init server
var app = express();
var server = http.createServer(app);
// init routes
var defaultRoute = require("./app/routes/default_route.js");
var adminRoute = require("./app/routes/admin_route.js");

var IOController = require("./app/controllers/io.controller.js");
var LOG = require("./app/utils/log");

LOG.warning("App running with log level = " + LOG.getLevel());
app.use(bodyParser.json()); // support pour les ficher json 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.set("Access-Control-Allow-Origin", CONFIG.reactserver);
    res.set("Access-Control-Allow-Credentials", true);
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
server.listen(CONFIG.port, CONFIG.addr, function () {
    var host = this.address().address;
    var port = this.address().port;

    LOG.log('[SERVER] App running at http://'+ host+':'+port);
});
IOController.listen(server);

app.use("/", express.static(path.join(__dirname, "public"))); // Ajoute une redirection vers le dossier public

app.use(defaultRoute);
app.use(adminRoute);

