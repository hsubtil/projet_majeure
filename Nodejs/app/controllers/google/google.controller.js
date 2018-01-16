"use strict";
var LOG = require("../../utils/log");
var GOOGLE = require("../../models/google/googleAuth.js");

var googleAuth = new GOOGLE();

module.exports = this;

this.setToken = function (token) {
    LOG.debug("IN SET TOKEN");
    LOG.debug(token);
    googleAuth.setToken(token);
}

this.getCalendarList = function (cb) {
    GOOGLE.create(googleAuth, function (err) {
        if (!err) {
            GOOGLE.getCalendarList(googleAuth,function (err, res) {
                if (!err) {
                    cb(null,res);
                }
                else {
                    cb('Error', null);
                }
            })
        }
    });
};