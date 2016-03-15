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
            user.Password = undefined;
            user.Roles = undefined;
            user.Terms = undefined;
            user.Meta = undefined;
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {

            process.nextTick(function() {
                User.findOne({
                    'Username': username
                }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('errorMessage', 'Er is al iemand met die gebruikersnaam'));
                    } else {
                        var newUser = new User();

                        var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(9));

                        newUser.Username = username;
                        newUser.Password = hash;
                        newUser.Name = req.body.name;
                        newUser.Email = req.body.email;
                        newUser.Meta.Created = new Date();

                        if (!req.body.terms)
                            return done(null, false, req.flash('errorMessage', 'Accepteer de terms en condities'));

                        newUser.Terms.v1.accepted = true;
                        newUser.Terms.v1.date = new Date();

                        if (newUser.validateSync())
                            return done(null, false, req.flash('errorMessage', newUser.validateSync().toString()));

                        newUser.save(function(err) {
                            if (err)
                                throw err;

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
                'Username': username
            }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'Deze gebruiker is helaas niet gevonden')); // req.flash is the way to set flashdata using connect-flash

                bcrypt.compare(password, user.Password, function(err, res) {
                    if (!res)
                        return done(null, false, req.flash('loginMessage', 'Het verkeerde wachtwoord is ingevoerd!'));

                    user.Password = undefined;

                    return done(null, user);
                });
            });

        }));

};