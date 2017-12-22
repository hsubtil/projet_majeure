"use strict";
var CONFIG = require("../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);

module.exports = this;

// RED -> "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
var colorCode = { 'warn': '\x1b[35m', 'error': "\x1b[31m", 'log': "\x1b[37m", 'debug': "\x1b[32m" };
var affichageLevel = ['error', 'warn', 'log', 'debug'];
var currentLevel = 'log';
//TODO

/**
 * Does console.log and formats the data a nice way
 * @param {any[]} ...args
 */
this.logConsole = function(code, msg) {
    var logToWrite;
    //console.log(affichageLevel.indexOf(currentLevel));
    if (affichageLevel.indexOf(code) <= affichageLevel.indexOf(currentLevel)) {
        console.log(colorCode[code], msg);
    }

}

this.debug = function (msg) {
    this.logConsole('debug','[DEBUG] '+msg)
}

this.log = function (msg) {
    this.logConsole('log',msg)
}
this.error = function (msg) {
    this.logConsole('error', msg)
}
this.warning = function (msg) {
    this.logConsole('warn', + msg)
}