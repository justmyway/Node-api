var LocalStrategy = require('passport-local').Strategy;
var OAuthStrategy = require('passport-oauth').OAuthStrategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var secretVariables = require('../config/oauth_secrets');

var User = require('../app/models/userModel').User;

var bcrypt = require('bcryptjs');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, '-Password -Email -Terms -Meta').exec(function(err, user){
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
                        User.findOne({
                            'Email': req.body.email
                        }, function(err, existingUser) {

                            if(existingUser){

                                var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(9));

                                existingUser.Username = username;
                                existingUser.Password = hash;
                                existingUser.Meta.Created = new Date();
                                existingUser.Roles = 'user';

                                if (!req.body.terms)
                                    return done(null, false, req.flash('errorMessage', 'Accepteer de terms en condities'));

                                existingUser.Terms.v1.accepted = true;
                                existingUser.Terms.v1.date = new Date();

                                if (existingUser.validateSync())
                                    return done(null, false, req.flash('errorMessage', newUser.validateSync().toString()));

                                existingUser.save(function(err) {
                                    if (err)
                                        return done(null, false, req.flash('errorMessage', err.message + ', ' + err));

                                    return done(null, existingUser);
                                });

                            }else{
                                var newUser = new User();

                                var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(9));

                                newUser.Username = username;
                                newUser.Password = hash;
                                newUser.Name = req.body.name;
                                newUser.Email = req.body.email;
                                newUser.Meta.Created = new Date();
                                newUser.Roles = 'user';

                                if (!req.body.terms)
                                    return done(null, false, req.flash('errorMessage', 'Accepteer de terms en condities'));

                                newUser.Terms.v1.accepted = true;
                                newUser.Terms.v1.date = new Date();

                                if (newUser.validateSync())
                                    return done(null, false, req.flash('errorMessage', newUser.validateSync().toString()));

                                newUser.save(function(err) {
                                    if (err)
                                        return done(null, false, req.flash('errorMessage', err.message + ', ' + err));

                                    return done(null, newUser);
                                });
                            }
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
            
            var quser = User.findOne({'Username': username});

            quser.select('Username Password Name Roles');

            quser.exec(function (err, user){
                if(err)
                    return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'Deze gebruiker is helaas niet gevonden')); // req.flash is the way to set flashdata using connect-flash

                bcrypt.compare(password, user.Password, function(err, res) {
                    if (!res)
                        return done(null, false, req.flash('loginMessage', 'Het verkeerde wachtwoord is ingevoerd!'));

                    user.Password = undefined;

                    return done(null, user);
                });
            });
        }
    ));

    passport.use('facebook-login', new FacebookStrategy({
            clientID: secretVariables.facebook.client_id,
            clientSecret: secretVariables.facebook.client_secret,
            callbackURL: ((process.env.callback_facebook) ? process.env.callback_facebook : secretVariables.facebook.callbackURL),
            profileFields: ['id', 'name', 'emails']
        },
        function(accessToken, refreshToken, profile, done){
            process.nextTick(function() {
                User.findOne({
                    'Email': String(profile.emails[0].value)
                }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        user.Name = profile.name.givenName + ' ' + profile.name.familyName;
                        user.Facebook.Name = profile.name.givenName + ' ' + profile.name.familyName;
                        user.Facebook.Id = String(profile.id);

                        user.save(function(err) {
                            if(err) 
                                throw err;
                            
                            return done(null, user);
                        });
                    } else {
                        var newUser = new User();

                        newUser.Name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.Facebook.Name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.Facebook.Id = String(profile.id);
                        newUser.Username = 'fb' + profile.id;
                        newUser.Password = 'none';
                        newUser.Email = String(profile.emails[0].value);
                        newUser.Meta.Created = new Date();
                        newUser.Roles = 'user';

                        newUser.Terms.v1.accepted = true;
                        newUser.Terms.v1.date = new Date();

                        if (newUser.validateSync())
                            return done(newUser.validateSync().toString());


                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                    }

                });

            });
        }
    ));

    passport.use('google-login', new GoogleStrategy({
            clientID: secretVariables.google.client_id,
            clientSecret: secretVariables.google.client_secret,
            callbackURL: ((process.env.callback_google) ? process.env.callback_google : secretVariables.google.callbackURL)
        },
        function(accessToken, refreshToken, profile, done){
            process.nextTick(function() {
                User.findOne({
                    'Email': String(profile.emails[0].value)
                }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        user.Name = profile.displayName;
                        user.Google.Name = profile.displayName;
                        user.Google.Id = String(profile.id);
                        user.Google.Email = profile.emails[0].value;
                        user.Google.Gender = profile.gender;

                        user.save(function(err) {
                            if(err) 
                                throw err;
                            
                            return done(null, user);
                        });
                    } else {
                        var newUser = new User();

                        newUser.Name = profile.displayName;
                        newUser.Email = String(profile.emails[0].value);
                        newUser.Google.Name = profile.displayName;
                        newUser.Google.Id = String(profile.id);
                        newUser.Google.Email = String(profile.emails[0].value);
                        newUser.Google.Gender = profile.gender;

                        newUser.Username = 'gg' + String(profile.id).substring(0, 16);
                        newUser.Password = 'none';
                        newUser.Meta.Created = new Date();
                        newUser.Roles = 'user';

                        newUser.Terms.v1.accepted = true;
                        newUser.Terms.v1.date = new Date();

                        if (newUser.validateSync()){
                            return done(newUser.validateSync().toString());
                        }


                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                    }

                });

            });
        }
    ));

};