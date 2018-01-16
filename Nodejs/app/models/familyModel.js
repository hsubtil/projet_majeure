"use strict";
var MongoClient = require('mongodb').MongoClient;
var jwt = require('jsonwebtoken');
var uuid = require('uuid');

var LOG = require("../utils/log");
var GOOGLE = require("../controllers/google/quickstart.js");

module.exports = Family;

function Family() {
    this.name;
    var calendarId;
    var code;

    this.setCode = function(pCode){
        code = pCode;
    }

    this.getCode = function(){
        return code;
    }

    this.setCalendarId = function (id) {
        calendarId = id;
    }
    
    this.getCalendarId = function () {
        return calendarId;
    }

    this.generateCalendar = function (cb) {
        var lock = 0;
        var id = GOOGLE.addCalendar(this.getCode(), function (err, res) {
            LOG.debug("[FAMILY MODEL] this.generateCalendar id: " + res['id']);
            cb(res['id']);
        });
    }

    this.generateCode = function () {
        var d = new Date().getTime();
        var uuid = 'xyxx-xxxx-xxxx-4xxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        this.setCode(uuid);
    }

    this.getFamilyJson = function () {
        LOG.debug("[FAMILY MODEL] this.getFamilyJSON id: " + this.getCalendarId());
        return { 'name': this.name, 'code': this.getCode(), 'calendarId': this.getCalendarId() };
    }
}

Family.init = function (family, cb) {
    LOG.log("[FAMILY MODEL] Init.");
    family.generateCode();
    family.generateCalendar(function (results) {
        family.setCalendarId(results);
        cb("Done");
    });
};
