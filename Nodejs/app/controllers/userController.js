'use strict';

var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    User = mongoose.model('User'),
    LOG = require("../utils/log"),
    CONFIG = require("../../config.json"),
    http = require('http');
process.env.CONFIG = JSON.stringify(CONFIG);

module.exports = this;

this.connection = function (req, res) {

};



/*
*   param :
*       socket : Client Socket.
*       json : JSON with all the info requierd for the registration of a new user in the database.
*       cb : callback function (optional)
*   Function responsible for the insertion in JEE database and MongoDB of a new user. 
*/

this.register = function (new_user_json, cb) {
    var newUser = new User(new_user_json);
    newUser.save(function (err, user) {
        if (err) {
            LOG.error(err)
        } else {
            cb(res.json(user));
        }
    });
    /*LOG.log("[DB] Registration to DB attempt " + JSON.stringify(new_user_json));
    db_object.database.collection(db_object.families_collection).insert(new_user_json, null, function (err, result) {
        if (err) {
            LOG.error("[DB] Error in DB insertion of new user " + JSON.stringify(new_user_json));
            LOG.error(err);
            if (cb)
                cb(err);
        }
        LOG.log("[DB] New user saved ");
        if (cb)
            cb(null);
    });*/
};

