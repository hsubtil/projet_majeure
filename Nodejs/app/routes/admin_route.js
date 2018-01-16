var CONFIG = JSON.parse(process.env.CONFIG);

var http = require('http');
var express = require("express");
var path = require("path");
var fs = require("fs");
var router = express.Router();

var LOG = require("../utils/log");

module.exports = router;


/************************************************************************************** ADMIN **************************************************************************************/
router.get("/admin/info", function (request, response) {
    LOG.warning("[ROUTER] /admin/info");
   response.send({ 'errorNb': '36','dbCapacity':'118GB','socketConnected':18});
});