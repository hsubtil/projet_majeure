'use strict';

var LOG = require("../../app/utils/log");
var socketsOpen = 0;


module.exports = this;

this.execute = function (cmd, socket) {
    //Create the function
    var fn = window[cmd];

    //Call the function
    fn(socket);
}

this.addSocket = function (socket) {
    socketsOpen++;
    LOG.log("[SOCKET] New socket " + socket.id,socket);
}

this.getNumberSockets = function (adminSocket) {
    adminSocket.emit("socket_number", socketsOpen);
}

