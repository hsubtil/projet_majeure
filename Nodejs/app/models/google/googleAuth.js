var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var gcal = require('google-calendar');


var config = {
    consumer_key: 'CONSUMER_KEY',
    consumer_secret: 'CONSUMER_SECRET',
    refresh_token: 'REFEASH_TOKEN'
};

passport.use(new GoogleStrategy({
    clientID: config.consumer_key,
    clientSecret: config.consumer_secret,
    callbackURL: "http://localhost:1337",
    scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
},
    function (accessToken, refreshToken, profile, done) {

        console.log(accessToken);
        console.log(profile);
        google_calendar = new gcal.GoogleCalendar(accessToken);

        return done(null, profile);
    }
));