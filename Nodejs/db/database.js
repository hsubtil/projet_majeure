"use strict";
var MongoClient = require('mongodb').MongoClient;
var LOG = require("../app/utils/log");

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
    this.database=null;
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
            if(cb)
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
Db.getUserByMail = function (db_object,user_mail,cb) {
        LOG.log("[DB] Looking for user with email: " + user_mail);
        db_object.database.collection(db_object.users_collection).find({email: user_mail }).toArray(function (error,result) {
            if (error) throw error;
            if (result[0] === undefined) {
                LOG.error("[DB] User not found : " + user_mail);
                if (cb)
                    cb("Error, user not found.");
            }
            else {
                LOG.log("[DB] User found " + JSON.stringify(result[0]));
                if (cb)
                    cb(result[0]);
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
        if(cb)
            cb(null);
    });
}
