"use strict";
var MongoClient = require('mongodb').MongoClient;
var jwt = require('jsonwebtoken');
var LOG = require("../utils/log");

var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);


module.exports = Db;

/**
 * DB Class
 *  db_name : Name of the DB in MongoDB
 *  dbURI : MongoDB uri
 *  users_collection : users table 
 *  families_collection : families table
 *  database : database object, require for query and insertion
 *
 */
function Db() {
    this.db_name = 'monpetitplanning'
    this.dbURI = "mongodb://localhost:27017/monpetitplanning";
    this.users_collection = "users";
    this.families_collection = "families";
    this.family_chat = "family-chat";
    this.family_list = "families-list";
    this.database = null;
}

/*
*   param :
*       db_object : object of type Db()
*       cb : callback function (optional)
*   Connect Function. Realise the connection to the database and save the instance in this.database of db_object.
*/
Db.connect = function (db_object, cb) {
    MongoClient.connect(db_object.dbURI, function (error, db) {
        if (error) {
            LOG.error("[DB] " + error);
            if (cb)
                cb(error);
        }
        LOG.log("[DB] Connection to " + db_object.db_name);
        db_object.database = db;
        if (cb)
            cb(null);
    });
}

/*
*   param :
*       db_object : object of type Db()
*       cb : callback function (optional)
*   Get all users. Query all the users register in the table users.
*/
Db.getAllUsers = function (db_object, cb) {
    LOG.log("[DB] Query of all users : ");
    db_object.database.collection(db_object.users_collection).find({}).toArray(function (error, results) {
        if (error) {
            LOG.error("[DB] " + error);
            if (cb)
                cb(error);
        }
        LOG.log(results);
        results.forEach(function (result) {
            LOG.debug(result)
            LOG.log("Name : " + result.name + "\n" + "Email : " + result.email);
            if (cb)
                cb(JSON.stringify(result[0]));
        });
    });
}

/*
*   param :
*       db_object : object of type Db()
*       user_mail : mail of the profil to find. 
*       cb : callback function (optional)
*   Get a user with an email. Return a specific user profil with his mail address.
*/
Db.getUserByMail = function (db_object, user_mail, cb) {
    LOG.log("[DB] Looking for user with email: " + user_mail);
    db_object.database.collection(db_object.users_collection).find({ email: user_mail }).toArray(function (error, result) {
        if (error) throw error;
        if (result[0] === undefined) {
            LOG.error("[DB] User not found : " + user_mail);
            if (cb)
                cb("Error, user not found.");
        }
        else {
            var user = result[0];
            LOG.log("[DB] User found " + JSON.stringify(user));
            if (cb) {
                cb(user);
            }

        }

    });
}

/*
*   param :
*       db_object : object of type Db()
*       user_mail : mail of the profil to find.
*       new_info: info to update in the profile
*       cb : callback function (optional)
*   Get a user with an email and update him.
*/
Db.updateUserByMail = function (db_object, user_mail, new_info, cb) {
    LOG.log("[DB] Looking for user with email: " + user_mail);
    db_object.database.collection(db_object.users_collection).find({ email: user_mail }).toArray(function (error, result) {
        if (result[0] === undefined) {
            LOG.error("[DB] User not found for update : " + user_mail);
            if (cb)
                cb("Error, user not found.");
        }
        else {
            var user = result[0];
            var newvalues = { "$set": new_info };
            LOG.log("[DB] User id " + JSON.stringify(user));
            db_object.database.collection(db_object.users_collection).update(user, newvalues, function (err, res) {
                if (err) {
                    LOG.error("[DB] Error in updating user")
                    LOG.error(err);
                } else {
                    LOG.log("[DB] Document updated");
                }
            });
            if (cb) {
                cb(user);
            }

        }
    });
}
/*
*   param :
*       db_object : object of type Db()
*       new_user_json : JSON { 'email': "nabil.fekir@ol.com", 'name': "nabil", 'surname': "fekir", 'address': "Rue du stade", 'cp': "69110", 'city': "Decines", 'country': "France", 'birthday': "19-12-93" }
*       cb : callback function (optional)
*  Register. Insert a new user in the database.
*  /!\ There is no verification done in case of user duplication. This should be done in JEE DB. 
*/
Db.register = function (db_object, new_user_json, cb) {
    LOG.log("[DB] Registration to DB attempt " + JSON.stringify(new_user_json));
    db_object.database.collection(db_object.users_collection).insert(new_user_json, null, function (err, result) {
        if (err) {
            LOG.error("[DB] Error in DB insertion of new user " + JSON.stringify(new_user_json));
            LOG.error(err);
            if (cb)
                cb(err);
        } else {
            LOG.log("[DB] New user saved ");
        }
        if (cb)
            cb(null);
    });
}

/*
*
*/
Db.getUserFamilies = function (db_object, user_mail, cb) {
    LOG.log("[DB] Looking for user families : " + user_mail);
    db_object.database.collection(db_object.families_collection).find({ email: user_mail }).toArray(function (error, result) {
        if (error) throw error;
        if (result[0] === undefined) {
            LOG.error("[DB] User not found : " + user_mail);
            if (cb)
                cb("Error, user not found.");
        }
        else {
            var families = result[0];
            LOG.log("[DB] User families " + JSON.stringify(families));
            if (cb) {
                cb(families);
            }

        }

    });
}

Db.getFamily = function (db_object, family_name, cb) {
    LOG.log("[DB] Get family from family list: " + JSON.stringify(family_name));
    var newvalues;
    db_object.database.collection(db_object.family_list).find({ name: family_name }).toArray(function (error, result) {
        if (error) throw error;
        if (result[0] === undefined) {
            LOG.error("[DB] Family not found : " + family_name);
            if (cb)
                cb("Family, user not found.",null);
        }
        else {
            var family = result[0];
            LOG.log("[DB] Get family " + JSON.stringify(family));
            if (cb) {
                cb(null,family);
            }

        }
    });
}

Db.getFamilyWithCode = function (db_object, family_code, cb) {
    LOG.log("[DB] Get family from family list with code: " + JSON.stringify(family_code));
    var newvalues;
    db_object.database.collection(db_object.family_list).find({ code: family_code }).toArray(function (error, result) {
        if (error) throw error;
        if (result[0] === undefined) {
            LOG.error("[DB] Family not found : " + family_name);
            if (cb)
                cb("Family, user not found.", null);
        }
        else {
            var family = result[0];
            LOG.log("[DB] Get family " + JSON.stringify(family));
            if (cb) {
                cb(null, family);
            }

        }
    });
}

Db.addFamily = function (db_object, family_info, cb) {
    LOG.log("[DB] Adding new family to family list: " + JSON.stringify(family_info));
    var newvalues;
    db_object.database.collection(db_object.family_list).insert(family_info, null, function (err, result) {
        if (err) {
            LOG.error("[DB] Error in DB insertion of new family in family-list " + JSON.stringify(family_info));
            LOG.error(err);
            if (cb)
                cb(err);
        }
        LOG.log("[DB] New family saved ");
        if (cb)
            cb(null);
    });
}

Db.addFamilyToUser = function (db_object, mail, family_info, cb) {
    LOG.log("[DB] Adding new family : " + JSON.stringify(family_info));
    var newvalues;
    db_object.database.collection(db_object.families_collection).find({ email: mail }).toArray(function (error, result) {
        if (result[0] === undefined) {
            LOG.error("[DB] User not found : " + user_mail);
            if (cb)
                cb("Error, user not found.");
        }
        else {
            var user = result[0];
            var newvalues = { "$addToSet": { "families": family_info } };
            LOG.log("[DB] User id " + JSON.stringify(user));
            db_object.database.collection(db_object.families_collection).update(user, newvalues, function (err, res) {
                if (err) {
                    LOG.error("[DB] Error in updating family")
                    LOG.error(err);
                } else {
                    LOG.log("[DB] Document updated");
                }
            });
            if (cb) {
                cb(user);
            }

        }
    });

}
/*
*  param : msg, JSON {code:, user:, date: , content: }
*/
Db.saveMessage = function (db_object,msg, cb) {
    LOG.log("[DB] Saving message in DB :" + JSON.stringify(msg));
    db_object.database.collection(db_object.family_chat).insert(msg, null, function (err, result) {
        if (err) {
            LOG.error("[DB] Error in DB insertion of new msg " + JSON.stringify(msg));
            LOG.error(err);
            if (cb)
                cb(err);
        }
        LOG.log("[DB] New msg saved.");
        if (cb)
            cb(null);
    });
    
}

/*
    param : db_object
            code : family code
            cb : callback

    Function that retrive all the messages relative to a family. 
*/
Db.loadMessages = function (db_object, code, cb) {
    LOG.log("[DB] Get all messages for family with code " + code);
    db_object.database.collection(db_object.family_chat).find({ code: code }).toArray(function (err, result) {
        if (err) {
            LOG.error("[DB] Error in DB when reading msgs " + JSON.stringify(msg));
            LOG.error(err);
            if (cb)
                cb(err,null);
        }
        LOG.log("[DB] All messages retrived from db");
        LOG.debug(JSON.stringify(result));
        if (cb)
            cb(null,result);
    });

}
/*
*   param :
*       db_object : object of type Db()
*       cb : callback function (optional)
*   Disconnect. Realise the deconnection of the database. 
*/
Db.disconnect = function (db_object, cb) {
    LOG.log("[DB] Deconnection to " + db_object.db_name);
    db_object.database.close(function (err) {
        if (err) {
            LOG.error("[DB] " + err);
            if (cb)
                cb(err);
        }
        if (cb)
            cb(null);
    });
}

