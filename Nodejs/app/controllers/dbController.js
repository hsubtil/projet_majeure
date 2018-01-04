"use strict";

var LOG = require("../utils/log");
var DB = require("../models/dbModel.js");
var db = new DB();
var FAMILY = require("../models/familyModel.js");

module.exports = this;

/***************************************************************************** USERS *****************************************************************************/

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

this.updateUser = function (mail, new_info, cb) {
    DB.connect(db, function (error){
        DB.updateUserByMail(db, mail, new_info, function (res) {
            if (cb)
                cb(res);
            DB.disconnect(db);
        });
    });
}
/***************************************************************************** FAMILIES *****************************************************************************/
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

this.getFamily = function (name, cb) {
    DB.connect(db, function (error) {
        DB.getFamily(db, name, function (err,res) {
            if (cb) {
                cb(err,res);
            }
            DB.disconnect(db);
        });
    });

}

this.getFamilyWithCode = function (code, cb) {
    DB.connect(db, function (error) {
        DB.getFamilyWithCode(db, code, function (err, res) {
            DB.disconnect(db);
            if (cb) {
                cb(err, res);
            }
        });
    });
}

this.addFamily = function (family_object, cb) {
    DB.connect(db, function (error) {
        var familyJSON = family_object.getFamilyJson();
        DB.addFamily(db, familyJSON, function (res) {
            if (cb) {
                cb(res);
            }
            DB.disconnect(db);
        });
    });
}

this.addFamilyToUser = function (email, family, cb) {
    DB.connect(db, function (error) {
        DB.addFamilyToUser(db, email, family, function (res) {
            if (cb) {
                cb(res);
            }
            DB.disconnect(db);
        });
    });
}

// TO DO : 
// Update families
// Create families

    /***************************************************************************** CHAT *****************************************************************************/

this.saveMessage = function (msg, cb) {
    DB.connect(db, function (err) {
        if (!err) {
            DB.saveMessage(db, msg, function (error) {
                if (cb) {
                    cb(error);
                }
            });
        }
        DB.disconnect(db);
    });
}

this.loadMessages = function (code, cb) {
    DB.connect(db, function (err) {
        if (!err) {
            DB.loadMessages(db, code, function (error,res) {
                if (cb) {
                    cb(error,res);
                }
            });
        }
        DB.disconnect(db);
    });
}