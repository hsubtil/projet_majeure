var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var LOG = require("../../utils/log");

// https://developers.google.com/google-apps/calendar/quickstart/nodejs

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
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
function authorize(credentials, callback) {
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
};

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
this.listUserEvents = function (calendar_id, cb) {
   /* LOG.warning(auth['credentials']['access_token']);
    var google_calendar = new gcal.GoogleCalendar(auth['credentials']['access_token']);
    google_calendar.calendarList.list(function (err, calendarList) {
        LOG.error(JSON.stringify(err));
        console.log(calendarList);
    });*/
    LOG.log("[GOOGLE WS] Retrieve events from calendar :" + calendar_id);

    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            cb(err,null);
        }
        // Authorize a client with the loaded credentials, then call the
        // Google Calendar API.
        authorize(JSON.parse(content), function (oAuth) {
            var calendar = google.calendar('v3');
            calendar.events.list({
                auth: oAuth,
                calendarId: calendar_id,
                timeMin: (new Date()).toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime'
            }, function (err, response) {
                if (err) {
                    LOG.error('The API returned an error: ' + err);
                    cb(err,null);
                }
                if (response) {
                    var events = response.items;
                    if (events.length === 0) {
                        LOG.log('No upcoming events found.');
                    } else {
                        console.log('Upcoming 10 events:');
                        for (var i = 0; i < events.length; i++) {
                            var event = events[i];
                            var start = event.start.dateTime || event.start.date;
                            console.log('%s - %s', start, event.summary);
                        }
                        console.log(JSON.stringify(calendar));
                        cb(null, events);
                    }
                } else {
                    LOG.error("[GOOGLE] Invalide request for getting calendar.");
                }
            });
        });
    });


}

this.addEvents = function (calendar_id, event_json, cb) {
    LOG.log("[GOOGLE] Add event ");
    var calendar = google.calendar('v3');
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            cb(err, null);
        }
        authorize(JSON.parse(content), function (oAuth) {
            calendar.events.insert({
                auth: oAuth,
                calendarId: calendar_id,
                resource: event_json,
            }, function (err, event_json) {
                if (err) {
                    LOG.error('There was an error contacting the Calendar service: ' + err);
                    cb(err,null);
                }
                LOG.log("[GOOGLE] Event created");
                cb(null, event_json);
             });
        });
    });
}

/*

*/
this.deleteEvent = function (calendar_id, event_id, cb) {
 
    var calendar = google.calendar('v3');
    LOG.log("[GOOGLE] Delete event in calendar"+calendar_id);
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            cb(err, null);
        }
        authorize(JSON.parse(content), function (oAuth) {
            calendar.events.delete({
                auth: oAuth,
                calendarId: calendar_id,
                eventId: event_id,
            }, function (err, reply) {
                if (err) {
                    LOG.error('There was an error contacting the Calendar service: ' + err);
                    cb(err, null);
                }
                if (!reply) {
                    LOG.log("[GOOGLE] Event delete");
                    cb(null, 'ok');
                }
                else {
                    LOG.error("[GOOGLE] Error in deleting event");
                    cb(err, null);
                }
            });
        });
    });

}


/*
*  resp = JSON {id,etag,summary}
*/
this.addCalendar = function (calendar_name, cb) {
    // @TODO
    var calendar = google.calendar('v3');
    LOG.log("[GOOGLE] Create calendar");
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            cb(err,null);
        }
        authorize(JSON.parse(content), function (oAuth) {
            calendar.calendars.insert({
                auth: oAuth,
                resource: { summary: calendar_name }
            }, function (err, resp) {
                if (err) {
                    LOG.error('There was an error contacting the Calendar service: ' + err);
                    cb(err,null);
                }
                LOG.log("[GOOGLE] Calendar created")
                console.log(resp);
                if (cb)
                    cb(null,resp);
            });
        });
     });
};

