"use strict";
var LOG = require("../../app/utils/log");

this.listen = function (server){
    LOG.debug("In io.controller.js");
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function (socket) {
        LOG.debug("Socket ++",socket);
        socketsOpen++;
    });
}