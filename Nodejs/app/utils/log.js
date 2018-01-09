"use strict";
const dateTime = require('date-time');

module.exports = this;

// RED -> "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
var colorCode = { 'warn': '\x1b[35m', 'error': "\x1b[31m", 'log': "\x1b[37m", 'debug': "\x1b[32m" };
var affichageLevel = ['error', 'warn', 'log', 'debug'];
var currentLevel = 'log';

/**
 * Does console.log and formats the data a nice way
 * Param : - affichageLevel['error', 'warn', 'log', 'debug']
 *         - msg
*/
this.logConsole = function(code, msg) {
    var logToWrite;
    //console.log(affichageLevel.indexOf(currentLevel));
    if (affichageLevel.indexOf(code) <= affichageLevel.indexOf(currentLevel)) {
        console.log(colorCode[code], msg);
    }

}

this.debug = function (msg) {
  var d = dateTime({local: false});
  this.logConsole('debug', '[' + d.toString() + '] '+ '[DEBUG] ' + msg);
}

this.log = function (msg) {
    var d = dateTime({ local: false });
    this.logConsole('log', '[' + d.toString() + '] '+ msg);
}
this.error = function (msg) {
    var d = dateTime({ local: false });
    this.logConsole('error', '[' + d.toString() + '] ' + msg);
}
this.warning = function (msg) {
    var d = dateTime({ local: false });
    this.logConsole('warn', '[' + d.toString() + '] ' + msg);
}