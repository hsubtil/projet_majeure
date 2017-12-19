"use strict";
var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);

var fs = require("fs");
var path = require("path");

module.exports = this;
var io;
var socket_map = {};

this.listen = function (server) {
    console.log("[SOCKET] In io.controller.js");
    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function (socket) {
        console.log("[SOCKET] New client " + socket.id);
        socket_map[socket.id] = socket;

        socket.on('auth_attempt', function (json_object) {
            console.log("[SOCKET] Connection event");
            console.log(json_object);
            //TODO add redirection for Olivier 
        });
        socket.on('signUp_attempt', function (json_object) {
            console.log("[SOCKET] Sign Up event");
            console.log(json_object);
        });
        socket.on('disconnect', function () {
            console.log("[SOCKET] Client %s disconnect event", socket.id);
            delete socket_map[socket.id];

        });
    });

}