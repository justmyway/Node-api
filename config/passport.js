var LocalStrategy = require('passport-local').Strategy;
var OAuthStrategy = require('passport-oauth').OAuthStrategy;

var User = require('../app/models/userModel').User;

var bcrypt = require('bcryptjs');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Local signup fuction
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            console.log('1');

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({
                    'Username': username
                }, function(err, user) {
                    console.log('2');
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        // return done(null, false, req.flash('errorMessage', 'Er is al iemand met die gebruikersnaam.'));
                        // return done(null, false, { 'error': 'Er is al iemand met die gebruikersnaam.' });
                        req.flash('error2', 'error2');
                        req.session.sessionFlash = {
                            type: 'error',
                            message: 'Er is al iemand met die gebruikersnaam.'
                        }
                        return done(null, false, req);
                    } else {
                        console.log('3');

                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        var salt = bcrypt.genSaltSync(4);
                        console.log("salt: " + salt);

                        var hash = bcrypt.hashSync(password, salt);
                        console.log("hash: " + hash);

                        newUser.Username = username;
                        newUser.Password = hash;
                        newUser.Name = req.body.name;
                        newUser.Email = req.body.email;

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            console.log('4');
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({
                'username': username
            }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'Deze gebruiker is helaas niet gevonden.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Het verkeerde wachtwoord is ingevoerd!')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });

        }));

};