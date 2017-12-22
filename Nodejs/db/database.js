"use strict";
var MongoClient = require('mongodb').MongoClient;
var LOG = require("../app/utils/log");

module.exports = Db;

function Db() {
    this.dbURI = "mongodb://localhost:27017/monpetitplanning";
    this.users_collection = "users";
    this.database=null;

}

Db.connect = function (db_object, cb) {
    MongoClient.connect(db_object.dbURI, function (error, db) {
        if (error) cb(error);
        LOG.log("[DB] Connecté à la base de données 'monpetitplanning'");
        db_object.database = db;
        cb("Sucess");
    });
}

Db.getAllUsers = function (db_object) {
    LOG.log("[DB] Query of all users:");
    db_object.database.collection("users").find({}).toArray(function (error, results) {
        if (error) throw error;
        LOG.log(results);
        results.forEach(function (result) {
            LOG.debug(result)
            console.log("Name : " + result.name + "\n" + "Email : " + result.email);
        });
    });
}

Db.getUserByMail = function (db_object,user_mail,cb) {
    //TODO
        LOG.log("[DB] Looking for user with email: " + user_mail);
        db_object.database.collection(db_object.users_collection).find({email: user_mail }).toArray(function (error,result) {
            if (error) throw error;
            if (result[0] === undefined) {
                LOG.error("[DB] User not found : " + user_mail);
                cb("Error, user not found.");
            }
            else {
                LOG.log("[DB] User found " + JSON.stringify(result[0]));
                cb(result[0]);
            }

        });
    /*
        posts.find({ author: "Daniel" }).toArray(function (err, results) {
            console.log(results); // output all records
        });*/
}
/*
function getAll(db) {
    db.collection("users").find({}).toArray(function (error, results) {
        if (error) throw error;
        LOG.log(results);
        results.forEach(function (result) {
            LOG.debug(result)
            console.log("Name : " + result.name + "\n" + "Email : " + result.email);
        });
    });
}

function getUser() {

}*/