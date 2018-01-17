var CONFIG = JSON.parse(process.env.CONFIG);
var STATS = require("../utils/stats");

var http = require('http');
var express = require("express");
var path = require("path");
var fs = require("fs");
var router = express.Router();

var LOG = require("../utils/log");
var DB = require("../controllers/dbController.js"); // DB Controller 

module.exports = router;


/************************************************************************************** ADMIN **************************************************************************************/
router.get("/admin/info", function (request, response) {
    LOG.warning("[ROUTER] /admin/info");
    DB.getStats(function (stats) {
        LOG.log(JSON.stringify(stats));
        var dbCapacity = stats['dataSize'] / 100;
        response.send({ 'upTime': STATS.getUpTime(), 'errorNb': STATS.getErrorFromStats(), 'logEntry': STATS.getLogEntryFromStats(), 'dbCapacity': dbCapacity.toString()+' KB', 'dbObjects':stats['objects'],'socketConnected': STATS.getSocketStats() });
    });    
});

router.get("/admin/services", function (request, response) {
    LOG.warning("[ROUTER] /admin/services_stats");
    response.send({ 'labels': ['Chat', 'Family', 'Profile', 'GoogleCalendar', 'Auth', 'Meteo'], 'series': STATS.getServicesStats()});
});