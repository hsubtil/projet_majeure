"use strict";

module.exports = this;

var socketsOpen = 0;
var errorCount = 0;
var logEntry = 0;

var chatRequest = 0;
var familyRequest = 0;
var profileRequest = 0;
var googleRequest = 0;
var authRequest = 0;
var meteoRequest = 0;

var newUser = 0;
var dbRequest = 0;

this.addNewUser = function () {
    newUser++;
};

this.addChatRequest = function () {
    chatRequest++;
};

this.addFamilyRequest = function () {
    familyRequest++;
};

this.addProfileRequest = function () {
    profileRequest++;
};

this.addGoogleRequest = function () {
    googleRequest++;
};

this.addAuthRequest = function () {
    authRequest++;
};

this.addMeteoRequest = function () {
    meteoRequest++;
};

this.getDbRequest = function () {
    return dbRequest;
}
this.getServicesStats = function () {
    return [[chatRequest, familyRequest, profileRequest, googleRequest, authRequest, meteoRequest]];
}

this.addErrorToStats = function () {
    errorCount++;
};

this.getErrorFromStats = function () {
    return errorCount;
};

this.addLogEntry = function () {
    logEntry++;
}

this.getLogEntryFromStats = function () {
    return logEntry;
}

this.addSocketToStats = function () {
    socketsOpen++;
}

this.removeSocketFromStats = function () {
    socketsOpen--;
}

this.getSocketStats = function () {
    return socketsOpen;
}

this.getUpTime = function () {
    var seconds = process.uptime();
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

