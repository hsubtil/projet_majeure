"use strict";
var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);
var LOG = require("../utils/log");
var http = require('http');

module.exports = this;

/*
*   param :
*       socket : Client socket
*       json : JSON with all the info for the connection. The json will be send to jee server.
*       cb : callback function (optional)
*   This function is responsible for sending request to JEE server for the connection of a user. It's also responsible of sending the reply. 
*/
this.connection = function (socket, json, cb) {
    var json_string = JSON.stringify(json);
    LOG.debug("In connection " + json_string);

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
            console.log(msg);
            if (msg === "") {
                LOG.error("[HTTP] <- Empty reply form JEE Auth attempt " + json_string);
                socket.emit('auth_failed', null);
                if (cb)
                    cb("auth_failed");
            }
            else {
                LOG.debug(msg);
                var reply = JSON.parse(msg);
                // var reply = JSON.parse(msg + "'sessionID':" + socket.id + "");
                if (reply['validAuth'] === false) {
                    LOG.log("[HTTP] <- Auth is false form JEE Auth attempt " + reply);
                    socket.emit('auth_failed', reply);
                    if (cb)
                        cb("auth_failed","Auth is not valid.");
                }
                else {
                    LOG.log("[HTTP] <- Auth is true form JEE Auth attempt " + reply);
                    if (cb)
                        cb(null);
                }
            }
        });
    });

    req.on('timeout', function () {
        LOG.error("[HTTP] Jee server reply Timeout");
        if (cb)
            cb("Timeout in the communication with JEE server.");
    });

    req.on('error', function (e) {
        LOG.error("[HTTP] <- Error in the comm with JEE server ");
        LOG.error(e);
        socket.emit('node_error', "Error in requetes.js function:connection");
        LOG.log("[SOCKET] Emit error event");
    });
    req.write(json_string);
    req.setTimeout(10000);
    req.end();
}

/*
*   param :
*       socket : Client Socket.
*       json : JSON with all the info requierd for the registration of a new user in the database.
*       cb : callback function (optional)
*   Function responsible for the insertion in JEE database and MongoDB of a new user. 
*/
this.register = function (socket, json, cb) {
    var json_string = JSON.stringify(json);
    LOG.debug("In register " + json_string);

    var options = {
        host: CONFIG.jeeserver,
        port: CONFIG.jeeport,
        path: '/FrontAuthWatcherWebService/rest/WatcherAuth',     //  Check Path With Olivier
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': json_string.length
        }
    };

    var req = http.request(options, function (res) {
        LOG.log("[HTTP] -> Send to JEE Registration attempt " + json_string);
        LOG.log("[HTTP] -> Request to JEE server with options " + JSON.stringify(options));
        var msg = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            msg += chunk;
        });

        res.on('end', function () {
            console.log(msg);
            if (msg === "") {
                LOG.error("[HTTP] <- Empty reply form JEE Registration attempt " + json_string);
                socket.emit('registration_failed', null);
                if (cb)
                    cb("register_failed");
            }
            else {
                LOG.debug(msg);
                var reply = JSON.parse(msg);
                // var reply = JSON.parse(msg + "'sessionID':" + socket.id + "");
                if (reply['validRegister'] === false) {   //************************************************************************ ASK OLIVIER
                    LOG.log("[HTTP] <- Registration is false form JEE Registration attempt " + reply);
                    socket.emit('registration_failed', reply);
                    if (cb)
                        cb("register_failed");
                }
                else {
                    LOG.log("[HTTP] <- Registration is true form JEE Registration attempt " + reply);
                    socket.emit('registration_success');
                    if (cb)
                        cb(null);
                }
            }
        });
    });

    req.on('timeout', function () {
        LOG.error("[HTTP] Jee server reply Timeout");
        if (cb)
            cb("Timeout");
    });

    req.on('error', function (e) {
        LOG.error("[HTTP] <- Error in the comm with JEE server ");
        LOG.error(e);
        socket.emit('node_error', "Error in request.js function:register");
        LOG.log("[SOCKET] Emit error event");
        if (cb)
            cb(e);
    });
    req.write(json_string);
    req.setTimeout(10000);
    req.end();

}


