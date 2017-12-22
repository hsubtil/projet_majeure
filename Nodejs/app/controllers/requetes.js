"use strict";
var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
var LOG = require("../utils/log");

var http = require('http');

module.exports = this;


function GenerateConnectionJSON(inputJson, socketId) {
    var outputJson;
    var login = inputJson['login'];
    var auth = inputJson['validAuth'];
    return { 'login': login, 'validAuth': auth, 'sessionID': socketId };
}

//TODO put somewhere 
this.connection = function (socket, json) {
    var json_string = JSON.stringify(json);
    LOG.debug("In connection " + json_string);
    
    var options = {
        host: "192.168.1.103",
        port: "8080",
        path: '/FrontAuthWatcherWebService/rest/WatcherAuth',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': json_string.length
        }
    };
    //FrontAuthWatcherWebService/rest/WatcherAuth

    LOG.debug("Avant request");
    var req = http.request(options, function (res) {
        LOG.log("[HTTP] -> Send to JEE Auth attempt " + json_string);
        LOG.log("[HTTP] -> Request to JEE server with options " + JSON.stringify(options));
        var msg = '';
        res.setEncoding('utf8');
 

        res.on('data', function (chunk) {
            msg += chunk;
        });
        res.on('end', function () {
            LOG.debug("TESTTTTTTT");
            console.log(msg);
            if (msg === "") {
                LOG.error("[HTTP] <- Empty reply form JEE Auth attempt " +json_string);
                socket.emit('auth_failed', "");
            }
            else {
                LOG.debug(msg);
                var reply = JSON.parse(msg);
                // var reply = JSON.parse(msg + "'sessionID':" + socket.id + "");
                if (reply['validAuth'] === false) {
                    LOG.log("[HTTP] <- Auth is false form JEE Auth attempt " + reply);
                    socket.emit('auth_failed', reply);
                }
                else {
                    LOG.log("[HTTP] <- Auth is true form JEE Auth attempt " + reply);
                    socket.emit('auth_success', reply);
                }
            }
        });
    });

    req.on('timeout', function () {
        LOG.error("Timeout");
    });
    req.on('error', function (e) {
        LOG.error("[HTTP] <- Error in the comm with JEE server ");
        LOG.error(e);
        socket.emit('node_error', { 'error': "Error in nodejs server" });
        LOG.log("[SOCKET] Emit error event");
    });
    req.write(json_string);
    req.setTimeout(10000);
    req.end();
}

this.register = function (socket, json) {
    //TODOs
}


