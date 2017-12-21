"use strict";
var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
var LOG = require("../utils/log");
var REQUEST = require("./requetes");
var DB = require("../../db/database.js");


var path = require("path");
var http = require('http');

module.exports = this;
var io;
var socket_map = {};

this.listen = function (server) {
    LOG.debug("[SOCKET] In io.controller.js");
    var io = require('socket.io').listen(server);
    var db = new DB();

    io.sockets.on('connection', function (socket) {
        LOG.log("[SOCKET] New client " + socket.id);
        socket_map[socket.id] = socket;

        socket.on('auth_attempt', function (json_object) {
            LOG.log("[SOCKET] Connection event");
            LOG.log(json_object);
            REQUEST.connection(socket, json_object);
            //TODO add redirection for Olivier 
        });

        socket.on('signUp_attempt', function (json_object) {
            LOG.log("[SOCKET] Sign Up event");
            LOG.log(json_object);
        });
        /*
        *  param : JSON {'mail':''}
        *  return : JSON { 'family': [{ 'name': "Monge", 'id': "36496", 'code': "codemonge" }, { 'name': "Fekir", 'id': "18496", 'code': "nabilon" }]}
        *  Request to MongoDB a user families
        *
        */

        // request_profile 
        socket.on('request_family', function (json_object) {
            LOG.log("[SOCKET] Request family info");
            socket.emit('request_family_reply', { 'family': [{ 'name': "Monge", 'id': "36496", 'code': "codemonge" }, { 'name': "Fekir", 'id': "18496", 'code': "nabilon" }]})
        });

        socket.on('request_profile', function (json_object) {
            LOG.log("[SOCKET] Request user profile");
            // TEST DB
            db.getAllUsers();
           // DB.getAll();
            socket.emit('request_profile_reply', { 'email': "nabil.fekir@ol.com",'name':"nabil",'surname':"fekir",'address':"Rue du stade",'cp':"69110",'city':"Decines",'country':"France",'birthday':"19-12-93"})
        });

        socket.on('chat', function (msg) {
            socket.broadcast.emit('chat', msg);
        });

        socket.on('disconnect', function () {
            LOG.log("[SOCKET] Client " + socket.id+" disconnect event");
            delete socket_map[socket.id];

        });
    });

}

/*
function registration(socket, json_object) {
    LOG.log('debug', "[DEBUG] in connection " + json_string.length);
    var options = {
        host: CONFIG.jeeserver,
        port: CONFIG.jeeport,
        path: '/FrontAuthWatcherWebService/rest/WatcherAuth',   // ASK OLIVIER
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': json_string.length
        }
    };

    var req = http.request(options, function (res) {
        var msg = '';
        res.setEncoding('utf8');
        LOG.log('log', "[HTTP] -> Send to JEE Register attempt " + JSON.stringify(json_string));
        LOG.log('log', "[HTTP] -> Request to JEE server with options " + JSON.stringify(options));

        res.on('data', function (chunk) {
            msg += chunk;
        });
        res.on('end', function () {
            console.log(msg);
            if (msg === "") {
                LOG.log('error', "[HTTP] <- Empty reply form JEE Auth attempt " + JSON.stringify(json_string));
                response.send(msg);
            }
            else {
                GenerateConnectionJSON(JSON.parse(msg), socket.id)
                // var reply = JSON.parse(msg + "'sessionID':" + socket.id + "");
                //Reply JSON
                if (reply['validAuth'] === false) {
                    LOG.log('log', "[HTTP] <- Auth is false form JEE Auth attempt " + JSON.stringify(json_string));
                    socket.emit('auth_reply', reply);
                }
                else {
                    LOG.log('log', "[HTTP] <- Auth is true form JEE Auth attempt " + JSON.stringify(json_string));
                    socket.emit('auth_reply', reply);
                }
            }
        });
    });

    req.on('error', function (e) {
        LOG.log('error', "[HTTP] <- Error in the comm with JEE server ");
        LOG.log('error', e);
    });
    req.setTimeout(5000);
    req.end();

}
*/