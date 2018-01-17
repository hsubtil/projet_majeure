"use strict";
const dateTime = require('date-time');
const STATS = require('./stats');

module.exports = this;

// RED -> "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
var colorCode = { 'warn': '\x1b[35m', 'error': "\x1b[31m", 'log': "\x1b[37m", 'debug': "\x1b[32m" };
var affichageLevel = ['error', 'warn', 'log', 'debug'];
var currentLevel = 'debug';

/**
 * Does console.log and formats the data a nice way
 * Param : - affichageLevel['error', 'warn', 'log', 'debug']
 *         - msg
*/
this.getLevel = function () {
    return currentLevel;
}

this.logConsole = function (code, msg, socket) {
    var logToWrite;
    //console.log(affichageLevel.indexOf(currentLevel));
    if (affichageLevel.indexOf(code) <= affichageLevel.indexOf(currentLevel)) {
        console.log(colorCode[code], msg);
        if (socket) {
            socket.emit("admin_log", msg);
            console.log("EMIT ADMIN");
        }
    }

}

this.debug = function (msg, socket) {
    var d = dateTime({ local: false });
    this.logConsole('debug', '[' + d.toString() + '] ' + '[DEBUG] ' + msg, socket);
}

this.log = function (msg, socket) {
    var d = dateTime({ local: false });
    this.logConsole('log', '[' + d.toString() + '] ' + msg, socket);
    STATS.addLogEntry();
}
this.error = function (msg, socket) {
    var d = dateTime({ local: false });
    this.logConsole('error', '[' + d.toString() + '] ' + msg, socket);
    STATS.addErrorToStats();
}
this.warning = function (msg, socket) {
    var d = dateTime({ local: false });
    this.logConsole('warn', '[' + d.toString() + '] ' + msg, socket);
}