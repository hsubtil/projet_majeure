// default_route.js
var CONFIG = JSON.parse(process.env.CONFIG);

var http = require('http');
var express = require("express");
var path = require("path");
var fs = require("fs");
var router = express.Router();

module.exports = router;


// / route
router.get("/", function (request, response) {
    response.send("It works !");
    console.log("[REDIRECT] Redirect to path / ");
});