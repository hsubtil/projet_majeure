var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var LOG = require("../../utils/log");
var gcal = require('google-calendar');

// https://developers.google.com/google-apps/calendar/quickstart/nodejs

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
console.log(process.env.HOME);
console.log(process.env.HOMEPATH);
console.log(process.env.USERPROFILE);
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

module.exports = this; 

// Load client secrets from a local file.
this.listEvents = function (cb) {
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Google Calendar API.
        authorize(JSON.parse(content), listUserEvents);
    });
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
this.authorize=function(credentials, callback) {
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
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    // @TODO: REMOVE CMD LINE AND ADD GOOGLE AUHT default_route.js
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
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    LOG.warning('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
this.listUserEvents = function (auth, cb) {
   /* LOG.warning(auth['credentials']['access_token']);
    var google_calendar = new gcal.GoogleCalendar(auth['credentials']['access_token']);
    google_calendar.calendarList.list(function (err, calendarList) {
        LOG.error(JSON.stringify(err));
        console.log(calendarList);
    });*/
    
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
            LOG.error('The API returned an error: ' + err);
            return;
        }
        var events = response.items;
        if (events.length == 0) {
            LOG.log('No upcoming events found.');
        } else {
            console.log('Upcoming 10 events:');
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var start = event.start.dateTime || event.start.date;
                console.log('%s - %s', start, event.summary);
            }
            console.log(JSON.stringify(calendar));
           // cb(calendar);
        }
    });
}

this.addEvents = function (auth) {
    var calendar = google.calendar('v3');   
    LOG.log("[GOOGLE] Add event");
    var event = {
        'summary': 'Test API mylittleplaner',
        'location': 'CPE Lyon',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
            'dateTime': '2018-01-15T09:00:00-10:00',
            'timeZone': 'America/Los_Angeles',
        },
        'end': {
            'dateTime': '2018-01-15T17:00:00-12:00',
            'timeZone': 'America/Los_Angeles',
        },
        'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'attendees': [
            { 'email': 'hs.subtil@gmail.com' },
            { 'email': 'mylittleplaner@gmail.com' },
        ],
        'reminders': {
            'useDefault': false,
            'overrides': [
                { 'method': 'email', 'minutes': 24 * 60 },
                { 'method': 'popup', 'minutes': 10 },
            ],
        },
    };

    calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        console.log('Event created: %s', event.htmlLink);
    });

    /*
    calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: {
            'summary': 'Sample Event',
            'description': 'Sample description',
            'start': {
                'dateTime': '2018-02-02T15:00:00',
                'timeZone': 'GMT',
            },
            'end': {
                'dateTime': '2018-02-02T16:00:00',
                'timeZone': 'GMT',
            },
        },
    }, function (err, res) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
        console.log(res);
    });*/
}