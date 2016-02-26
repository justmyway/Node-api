var LocalStrategy = require('passport-local').Strategy;
var OAuthStrategy = require('passport-oauth').OAuthStrategy;

var oath_Credentials = require('./oath_secrets');

module.exports = function(passport) {

    passport.use('avans', new OAuthStrategy({
            requestTokenURL: 'https://publicapi.avans.nl/oauth/request_token',
            accessTokenURL: 'https://publicapi.avans.nl/oauth/access_token',
            userAuthorizationURL: 'https://publicapi.avans.nl/oauth/login.php',
            consumerKey: oath_Credentials.spotify.client_id,
            consumerSecret: oath_Credentials.spotify.client_secret,
            callbackURL: oath_Credentials.spotify.callbackURL
        },
        function(token, tokenSecret, req, done) {

            process.nextTick(function() {

            });

        }
    ));

};