var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});

// Load models
var mongoose = require('mongoose');
var Users = mongoose.model('User');
var Routes = mongoose.model('Routes');

// Load middleware
var authenticateMiddleware = require('../middleware/authenticated');


module.exports = function(app, passport) {

    app.get('/profile/login', authenticateMiddleware.notAuthenticated, function(req, res) {

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

    app.get('/profile/register', authenticateMiddleware.notAuthenticated, function(req, res) {
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

    app.get('/profile', authenticateMiddleware.isAuthenticated, function(req, res) {

        Routes.find({
            Climber: req.user.Id
        }).limit(10).exec(function(err, climbedRoutes) {
            if (err)
                throw err;

            res.status(200).render('users/profile.ejs', {
            user: req.user,
                routes: climbedRoutes
            });
        });
    });
};