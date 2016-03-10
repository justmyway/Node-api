// load models
var mongoose = require('mongoose');
var Users = mongoose.model('User');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});

module.exports = function(app, passport) {

    app.get('/profile/login', function(req, res) {

        res.status(200).render('users/login.ejs', {
            page: 'login',
            error: req.flash('loginMessage')
        });
    });

    app.post('/profile/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/profile/login',
        failureFlash: true
    }));

    app.get('/profile/register', function(req, res) {
        res.status(200).render('users/register.ejs', {
            page: 'register',
            error: req.flash('errorMessage')
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