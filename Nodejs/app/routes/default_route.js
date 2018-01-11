// default_route.js
var CONFIG = JSON.parse(process.env.CONFIG);

var http = require('http');
var express = require("express");
var path = require("path");
var fs = require("fs");
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var router = express.Router();
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var LOG = require("../utils/log");
var quickstart = require("../controllers/google/quickstart.js");
module.exports = router;

var config = {
    consumer_key: '83179479104-ivpen2at0nkvmdjlgrrshjbuie4q7cgs.apps.googleusercontent.com',
    consumer_secret: 'TRNxQpuE5aZgu_7kmjlFfRtz',
    refresh_token: 'REFRESH_TOKEN'
};

LOG.debug("[GOOGLE] In GoogleCalendar connect");
var confi_json = {
    clientID: config.consumer_key,
    clientSecret: config.consumer_secret,
    callbackURL: "http://localhost:1337/auth/google/callback",
    scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
};
LOG.debug(JSON.stringify(confi_json));

passport.use(new GoogleStrategy(confi_json,
    function (accessToken, refreshToken, profile, done) {

        if (profile) {
            user = profile;
            return done(null, user);
        }
        else {
            return done(null, false);
        }
       /* User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });*/
    }
));
// used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
    // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


function getOAuthClient() {
    return new OAuth2(confi_json['consumer_key'], confi_json['clientSecret'], confi_json['callbackURL']);
}

function getAuthUrl() {
    var oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
        'https://www.googleapis.com/auth/plus.me'
    ];

    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes // If you only need one scope you can pass it as string
    });

    return url;
}


router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function (req, res) {
    LOG.log("[ROUTER] /auth/google/callback");
    //console.log(req);
    //console.log(res);

    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code; // the query param code
    console.log(code);
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Google Calendar API.
        quickstart.authorize(JSON.parse(content), function (oAuth) {
            LOG.warning(JSON.stringify(oAuth));
            // @TODO save oAuth do creatToken here
            quickstart.listUserEvents(oAuth, function () {

            });
            res.redirect('/');
        });
    });
    
    //Call create token

    /** oauth2Client.getToken(code, function (err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.

        if (!err) {
            LOG.debug("IN IF");
            oauth2Client.setCredentials(tokens);
            //saving the token to current session
            session["tokens"] = tokens;
            res.send(`
            &lt;h3&gt;Login successful!!&lt;/h3&gt;z
            &lt;a href="/details"&gt;Go to details page&lt;/a&gt;
        `);
        }
        else {
            LOG.debug("IN ELSE");
            console.log(err);
        }
    });**/
        // Successful authentication, redirect home.
   //     res.redirect('/');
    });

 /*route
router.get("/", function (request, response) {
    response.send("It works !");
    console.log("[REDIRECT] Redirect to path / ");
});*/

/*
router.post('/', function (request, response) {
    var data = JSON.stringify({
        'login': request.body['login'],
        'password': request.body['password']
    });
    console.log("[HTTP] -> Post /login " + data);
    var options = {
        host: 'localhost',
        port: '8080',
        path: '/FrontAuthWatcherWebService/rest/WatcherAuth',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': data.length
        }
    };

    	var req = http.request(options, function(res) {
          var msg = '';
          res.setEncoding('utf8');
          console.log("[HTTP] Request to JEE server " + JSON.stringify(options));
          
          res.on('data', function(chunk) {
            msg += chunk;
          });
          res.on('end', function() {
                console.log(msg);
                if(msg === "")
            {
                console.log("Empty reply from JEE webservice");	  
                response.send(msg);
            }
            else{
                var reply = JSON.parse(msg);
                    if(reply['validAuth'] === false){
                        console.log("validAuth is false");
                  //      res.end('<html><body>Auth is false</body></html>');
                    response.send(msg);
                }
                else{
                        //response.redirect("/admin");
                        response.send(msg);
                }
            }
          });
        });
        req.write(data);
        req.end();
   

});*/