"use strict";
var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
var LOG = require("../utils/log");
// JEE Client
var REQUEST = require("./requetes");
var DB = require("./dbController.js");


var path = require("path");
var http = require('http');
var jwt = require('jsonwebtoken');

module.exports = this;
var io;
var socket_map = {};

this.listen = function (server) {
    LOG.debug("In io.controller.js");
    var io = require('socket.io').listen(server);
    // Create new db object
    
    io.sockets.on('connection', function (socket) {
        LOG.log("[SOCKET] New client " + socket.id);
        socket_map[socket.id] = socket;

        /*
        *  param : JSON {'mail':"",'password':""}
        *  return : JSON { 'email': "nabil.fekir@ol.com", 'name': "nabil", 'surname': "fekir", 'address': "Rue du stade", 'cp': "69110", 'city': "Decines", 'country': "France", 'birthday': "19-12-93" }
        *  When Front server send an auth event, ask to JEE server if auth is valid or not. 
        */
        socket.on('auth_attempt', function (json_object) {
            LOG.log("[SOCKET] Connection event");
            LOG.log(json_object['email']);
            REQUEST.connection(socket, json_object, function (err) {
               if (!err) {
                createToken(json_object['email'], socket);
                }
            });
        });

        /*
        *  param : JSON {'mail':"",'password':""}
        *  return : JSON
        *  Registration attempt. If JEE reply with error (user alredy exist or insertion problem), no insertion in MongoDb. 
        */
        socket.on('sign_up_attempt', function (json_object) {
            LOG.log("[SOCKET] Sign Up event");
            LOG.log(json_object);
            REQUEST.register(socket, json_object, function (error) {
                if (!error) {
                    DB.register(json_object);
                }
            });  
        });

        /*
        *  param : JSON {'mail':''}
        *  return : JSON { 'family': [{ 'name': "Monge", 'id': "36496", 'code': "codemonge" }, { 'name': "Fekir", 'id': "18496", 'code': "nabilon" }]}
        *  Request to MongoDB a user families
        *
        */
        socket.on('request_family', function (json_object) {
            LOG.log("[SOCKET] Request family info");
            checkAuth(json_object['token'],socket, function (err) {
                if (!err) {
                    DB.getFamilies(json_object['email'], function (res) {
                        socket.emit('request_family_reply', res);
                    })
                }
            });
        });

        /*
        *  param : JSON {'mail':''}
        *  return : JSON { 'email': "nabil.fekir@ol.com", 'name': "nabil", 'surname': "fekir", 'address': "Rue du stade", 'cp': "69110", 'city': "Decines", 'country': "France", 'birthday': "19-12-93" }
        *  Request to MongoDB a user profile
        *
        */
        socket.on('request_profile', function (json_object) {
            LOG.log("[SOCKET] Request user profil");
            LOG.debug(json_object);
            checkAuth(json_object['token'],socket, function (err) {
                if (!err) {
                    DB.getProfile(json_object['email'],function (res) {
                        socket.emit('request_profile_reply', res);
                    });
                }
            });
        });

        /*
        *  param : null
        *  return : null
        *  Chat
        *
        */
        socket.on('chat', function (msg) {
            socket.broadcast.emit('chat', msg);
        });

        /*
        *  param : null
        *  return : null
        *  Disconnect a client from the socket_map
        *
        */
        socket.on('disconnect', function () {
            LOG.log("[SOCKET] Client " + socket.id+" disconnect event");
            delete socket_map[socket.id];
        });
    });

}

/**
 * 
 * @param {any} token
 * @param {any} socket
 * @param {any} cb
 */
function checkAuth(token, socket, cb) {
    jwt.verify(token, CONFIG.tokenkey, function (err, decoded) {
        if (err) {
            LOG.error("[AUTH] Token is false !");
            socket.emit("auth_failed","Token is false.");
            cb(err);
        } else {
            LOG.debug("[AUTH] Token is valid");
            LOG.debug(decoded.foo) // bar
            if (cb) {
                cb(null);
            }
        }

    });
}

/**
 * 
 * @param {any} email
 * @param {any} socket
 */
function createToken(email, socket) {
    DB.getProfile(email, function (res) {
        var token = JSON.stringify({ token: jwt.sign(res, CONFIG.tokenkey) });
        LOG.debug(token);
        socket.emit('registration_success', token);
    });
}


