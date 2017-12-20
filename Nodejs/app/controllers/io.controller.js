"use strict";
var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
var LOG = require("../utils/log");

var fs = require("fs");
var path = require("path");
var http = require('http');

module.exports = this;
var io;
var socket_map = {};

this.listen = function (server) {
    LOG.debug("[SOCKET] In io.controller.js");
    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function (socket) {
        LOG.log("[SOCKET] New client " + socket.id);
        socket_map[socket.id] = socket;

        socket.on('auth_attempt', function (json_object) {
            LOG.log("[SOCKET] Connection event");
            LOG.log(json_object);
            connection(socket, JSON.stringify(json_object));
            //TODO add redirection for Olivier 
        });
        socket.on('signUp_attempt', function (json_object) {
            LOG.log("[SOCKET] Sign Up event");
            LOG.log(json_object);
        });
        socket.on('disconnect', function () {
            LOG.log("[SOCKET] Client " + socket.id+" disconnect event");
            delete socket_map[socket.id];

        });
    });

}

//TODO put somewhere 
function connection(socket, json_string) {
    LOG.log('debug',"[DEBUG] in connection "+ json_string.length);
    var options = {
        host: CONFIG.jeeserver,
        port: CONFIG.jeeport,
        path: '/FrontAuthWatcherWebService/rest/WatcherAuth',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': json_string.length
        }
    };

    var req = http.request(options, function (res) {
        var msg = '';
        res.setEncoding('utf8');
        LOG.log("[HTTP] -> Send to JEE Auth attempt " + JSON.stringify(json_string));
        LOG.log("[HTTP] -> Request to JEE server with options " + JSON.stringify(options));

        res.on('data', function (chunk) {
            msg += chunk;
        });
        res.on('end', function () {
            console.log(msg);
            if (msg === "") {
                LOG.error("[HTTP] <- Empty reply form JEE Auth attempt " + JSON.stringify(json_string));
                response.send(msg);
            }
            else {
                var nodeReply = GenerateConnectionJSON(JSON.parse(msg),socket.id)
               // var reply = JSON.parse(msg + "'sessionID':" + socket.id + "");
                //Reply JSON
                if (reply['validAuth'] === false) {
                    LOG.log("[HTTP] <- Auth is false form JEE Auth attempt " + JSON.stringify(json_string));
                    socket.emit('auth_reply', nodeReply);
                }
                else {
                    LOG.log("[HTTP] <- Auth is true form JEE Auth attempt " + JSON.stringify(json_string));
                    socket.emit('auth_reply', nodeReply);
                }
            }
        });
    });

    req.on('error', function (e) {
        LOG.error("[HTTP] <- Error in the comm with JEE server " );
        LOG.error(e);
        socket.emit('Nodeerror', { 'error': "Error in nodejs server" });
        LOG.debug('Test ici !')
    });
    req.setTimeout(5000);
    req.end();
}

function GenerateConnectionJSON(inputJson, socketId) {
    var outputJson;
    var login = inputJson['login'];
    var auth = inputJson['validAuth'];
    return {'login': login, 'validAuth': auth, 'sessionID': socketId };
}

function test() {

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