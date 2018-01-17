"use strict";

var LOG = require("../utils/log");
var DB = require("../models/dbModel.js");
var db = new DB();
var FAMILY = require("../models/familyModel.js");

module.exports = this;

/**/
this.getStats = function (cb) {
    DB.connect(db, function (error) {
        if (!error) {
            DB.getStats(db, function (err, stats) {
                if (!err) {
                    DB.disconnect(db);
                    cb(stats);
                }
                else
                    DB.disconnect(db);
            });

        }
    });
}
/***************************************************************************** USERS *****************************************************************************/

this.register = function (json_object) {
    DB.connect(db, function (error) {
        if (!error) {
            DB.register(db, json_object);
            DB.disconnect(db);
        }
    });
};

this.getProfile = function (email, cb) {
    DB.connect(db, function (error) {
        LOG.debug("IN REQUEST PROFILE");
        LOG.debug(email);
        DB.getUserByMail(db, email, function (err,res) {
            if (cb) {
                if (!err)
                    cb(null, res);
                else
                    cb(err, res);
            }
                
            DB.disconnect(db);
        });
    });
};

this.updateUser = function (mail, new_info, cb) {
    DB.connect(db, function (error) {
        DB.updateUserByMail(db, mail, new_info, function (err,res) {
            if (cb)
                cb(err,res);
            DB.disconnect(db);
        });
    });
};

this.getAllUsers = function (cb) {
    DB.connect(db, function (error) {
        DB.getAllUsers(db, function (err, res) {
            if (cb)
                cb(err, res);
            DB.disconnect(db);
        });
    });
}

/***************************************************************************** FAMILIES *****************************************************************************/


this.getAllFamilies = function (cb) {
    DB.connect(db, function (error) {
        DB.getAllFamiliesDb(db, function (err, res) {
            if (cb)
                cb(err, res);
            DB.disconnect(db);
        });
    });
}

this.getFamilies = function (email, cb) {
    DB.connect(db, function (error) {
        DB.getUserFamilies(db, email, function (err, res) {
            if (cb) {
                //cb({ 'family': [{ 'name': "Monge", 'id': "36496", 'code': "codemonge" }, { 'name': "Fekir", 'id': "18496", 'code': "nabilon" }] });
                if (!err)
                    cb(null, res);
                else
                    cb(err, res);
            }
            DB.disconnect(db);
        });
    });

};

this.getFamily = function (name, cb) {
    DB.connect(db, function (error) {
        DB.getFamily(db, name, function (err, res) {
            if (cb) {
                cb(err, res);
            }
            DB.disconnect(db);
        });
    });

};

this.getFamilyByCode = function (code, cb) {
    DB.connect(db, function (error) {
        DB.getFamilyByCode(db, code, function (err, res) {
            if (cb) {
                cb(err, res);
            }
            DB.disconnect(db);
        });
    });

};

this.getFamilyWithCode = function (code, cb) {
    DB.connect(db, function (error) {
        DB.getFamilyWithCode(db, code, function (err, res) {
            DB.disconnect(db);
            if (cb) {
                cb(err, res);
            }
        });
    });
};

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
};

this.addFamilyToUser = function (email, family_code, family, cb) {
    DB.connect(db, function (error) {
        DB.addFamilyToUser(db, email, family, function (res) {
            DB.addUserToFamily(db, email, family_code, function (reply) {
                if (cb) {
                    cb(reply);
                }
                DB.disconnect(db);
            });
        });
    });
};

/*
* Get all the family members.
*/
this.getMemberOfFamily = function (family_code, cb) {
    DB.connect(db, function (error) {
        DB.getMemeberOfFamilyByCode(db, family_code, function (err, res) {
            if (cb) {
                cb(err,res);
            }
            DB.disconnect(db);
        });
    });
};
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
};

this.loadMessages = function (code, cb) {
    DB.connect(db, function (err) {
        if (!err) {
            DB.loadMessages(db, code, function (error, res) {
                if (cb) {
                    cb(error, res);
                }
            });
        }
        DB.disconnect(db);
    });
};

/***************************************************************************** LOCALISATION *****************************************************************************/

this.setLocalisation = function (email, localisation, cb) {
    DB.connect(db, function (err) {
        if (!err) {
            DB.setLocalisationToUser(db, email, localisation, function (error, res) {
                if (cb) {
                    cb(error, res);
                }
            });
        }
        DB.disconnect(db);
    });
}