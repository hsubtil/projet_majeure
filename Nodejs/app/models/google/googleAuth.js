"use strict";
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//var GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport = require('passport');
var gcal = require('google-calendar');
var LOG = require("../../utils/log");

module.exports = GoogleCalendar;
var accessToken;

function GoogleCalendar() {
    this.config = {
        consumer_key: '83179479104-ivpen2at0nkvmdjlgrrshjbuie4q7cgs.apps.googleusercontent.com',
        consumer_secret: 'TRNxQpuE5aZgu_7kmjlFfRtz',
        refresh_token: 'REFRESH_TOKEN'
    };
    var googleCalendar;
    var accessToken;

    this.setToken = function (token) {
        accessToken = token;
    }
    this.getToken = function () {
        return accessToken;
    }
    this.setGoogleCalendar = function (calendar) {
        googleCalendar = calendar;
    }
    this.getGoogleCalendar = function () {
        return googleCalendar;
    }
}

GoogleCalendar.create = function (googleCalendarObject, cb) {
    LOG.log("[GOOGLE MODEL] Create calendar object.");
    var token = googleCalendarObject.getToken(accessToken);
    LOG.debug(JSON.stringify(token));
    googleCalendarObject.setGoogleCalendar(new gcal.GoogleCalendar(token));
    var calendar = googleCalendarObject.getGoogleCalendar();
    LOG.debug(JSON.stringify(calendar));

    cb(null);
};

GoogleCalendar.getCalendarList = function (googleCalendarObject, cb) {
    LOG.log("[GOOGLE MODEL] Get Calendar list");
    var calendar = googleCalendarObject.getGoogleCalendar();
    LOG.debug(JSON.stringify(calendar));
    calendar.calendarList.list(function (err, calendarList) {
        if (!err) {
            LOG.debug(calendarList);
            cb(err, calendarList);
        } else {
            LOG.error("[GOOGLE MODEL] Get calendar list");
            LOG.error(JSON.stringify(err));
            cb(err, null);
        }
    });
};

GoogleCalendar.authorize = function(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            console.log("TESTT");
            console.log(oauth2Client);
            callback(oauth2Client);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
GoogleCalendar.getNewToken = function(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
GoogleCalendar.storeToken = function(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
GoogleCalendar.listEvents = function(auth) {
    var calendar = google.calendar('v3');
    calendar.events.list({
        auth: auth,
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var events = response.items;
        if (events.length == 0) {
            console.log('No upcoming events found.');
        } else {
            console.log('Upcoming 10 events:');
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var start = event.start.dateTime || event.start.date;
                console.log('%s - %s', start, event.summary);
            }
        }
    });
}

/*
GoogleCalendar.connect = function(cb){
    var google_calendar = new gcal.GoogleCalendar(accessToken);
    cb(null);
};

GoogleCalendar.setToken = function (token) {
    LOG.log("[GOOGLE] Set Token");
    accessToken = token;
};*/