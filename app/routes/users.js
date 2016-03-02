// load models
var mongoose = require('mongoose');
var Users = mongoose.model('User');
//var passport = require('passport');

module.exports = function(app, passport){

    app.get('/profile/login', function(req, res) {

        res.status(200).render('users/login.ejs', {
            page: 'login'
        });
    });

    app.post('/profile/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/profile/login',
        failureFlash: true
    }));

    app.get('/profile/register', function(req, res) {
        console.log('register router get');
        res.status(200).render('users/add.ejs', {
            page: 'register'
        });
    });

    app.post('/profile/register', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/profile/register',
        failureFlash: true
    }));

    app.get('/profile', function(req, res) {

        res.status(200).render('users/profile.ejs', {
            user: req.user
        });
    });
};