"use strict";

var LOG = require("../utils/log");
var DB = require("../models/dbModel.js");
var db = new DB();

module.exports = this;

this.register = function (json_object){
    DB.connect(db, function (error) {
        if (!err) {
            DB.register(db, json_object);
            DB.disconnect(db);
        }
    });
}

this.getProfile = function (email,cb) {
    DB.connect(db, function (error) {
        LOG.debug("IN REQUEST PROFILE");
        LOG.debug(email);
        DB.getUserByMail(db, email, function (res) {
            if(cb)
                cb(res);
            DB.disconnect(db);
        });
    });
}
    /*****************************************************************************FAMILIES*****************************************************************************/
this.getFamilies = function (email,cb) {
    DB.connect(db, function (error) {
        DB.getUserFamilies(db, email, function (res) {
            if (cb) {
                //cb({ 'family': [{ 'name': "Monge", 'id': "36496", 'code': "codemonge" }, { 'name': "Fekir", 'id': "18496", 'code': "nabilon" }] });
                cb(res);
            }
            DB.disconnect(db);
        });
    });

}

// TO DO : 
// Update families
// Create families