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
    LOG.log("[ROUTER] /admin/info");
    DB.getStats(function (stats) {
        LOG.log(JSON.stringify(stats));
        var dbCapacity = stats['dataSize'] / 100;
        response.send({ 'upTime': STATS.getUpTime(), 'errorNb': STATS.getErrorFromStats(), 'logEntry': STATS.getLogEntryFromStats(), 'dbCapacity': dbCapacity.toString()+' KB', 'dbObjects':stats['objects'],'dbRequest':STATS.getDbRequest(),'socketConnected': STATS.getSocketStats() });
    });    
});

router.get("/admin/services", function (request, response) {
    LOG.log("[ROUTER] /admin/services_stats");
    response.send({ 'labels': ['Chat', 'Family', 'Profile', 'GoogleCalendar', 'Auth', 'Meteo'], 'series': STATS.getServicesStats()});
});

router.get("/admin/dbInfo", function (request, response) {
    LOG.log("[ROUTER] /admin/dbInfo");
    var familiesArray = [];
    var userArray = [];
    DB.getAllFamilies(function (err, res) {
        LOG.warning("LAAAAA");
        for (var element in res) {
            console.log(res[element]);
            familiesArray.push([res[element]._id, res[element].name, res[element].code, res[element].calendarId])
        };
        console.log(familiesArray);
        //console.log(res[0]);
        DB.getAllUsers(function (err, reply) {
            for (var element in reply) {
                console.log(reply[element]);
                userArray.push([reply[element]._id, reply[element].email, reply[element].name, reply[element].surname, reply[element].address, reply[element].cp, reply[element].city, reply[element].country])
            };
            response.send({ 'familyListCol': ["ID", "Name", "Code", "Calendar Id"], 'userListCol': ["ID", "email", "name", "surname","address","cp","city","country"], 'familyListDb': familiesArray, 'userListDb': userArray });
        });
    });       
});

router.post("/admin/userInfo", function (request, response) {
    LOG.log('[ROUTER] /admin/userInfo ' + request.body['email']);
    DB.getProfile(request.body['email'], function (err, profil) {
        if(!err)
            response.send({ 'email': profil.email, 'name': profil.name, 'surname': profil.surname, 'address': profil.address, 'cp': profil.cp, 'city': profil.city, 'country': profil.country });
        else
            response.send({ 'email': "", 'name': "", 'surname': "", 'address': "", 'cp': "", 'city': "", 'country': "" });
    });
});

router.post("/admin/updateProfil", function (request, response) {
    console.log(request.body['profile']);

});



