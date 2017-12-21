"use strict";
var MongoClient = require('mongodb').MongoClient;
var LOG = require("../app/utils/log");

module.exports = Db;

function Db() {
    this.dbURI = "mongodb://localhost:27017/monpetitplanning";
    this.users_collection = "users";
    this.database=null;

}

Db.prototype.getAllUsers = function (cb) {
    MongoClient.connect(this.dbURI, function (error, db) {
        if (error) throw error;
        console.log("[DB] Connecté à la base de données 'monpetitplanning'");
        getAll(db);
    }); 
}

Db.prototype.getUserByMail = function (user_mail) {
    //TODO

    MongoClient.connect(this.dbURI, function (error, db) {
        if (error) throw error;
        console.log("[DB] Connecté à la base de données 'monpetitplanning'");
        getUser(user_mail);
    });
}

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

}