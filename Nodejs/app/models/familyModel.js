"use strict";
var MongoClient = require('mongodb').MongoClient;
var jwt = require('jsonwebtoken');
var uuid = require('uuid');

var LOG = require("../utils/log");
var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);

module.exports = Family;

function Family() {
    this.name;
    var code;

    this.setCode = function(pCode){
        code = pCode;
    }

    this.getCode = function(){
        return code;
    }

    this.generateCode = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        this.setCode(uuid);
    }

    this.getFamilyJson = function () {
        return { 'name': this.name, 'code': this.getCode() };
    }
}

