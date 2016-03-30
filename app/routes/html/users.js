// Load routing
var express = require('express');
var router = express.Router();

//remove:
/*var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});*/

// Load middleware
var authMiddleware = require('../../middleware/authenticated');

// Load models
var mongoose = require('mongoose');
var Users = mongoose.model('User');
var Routes = mongoose.model('Routes');

module.exports = function(passport){

    router.route('/')
        .get(authMiddleware.isAuthenticated, function(req, res) {

            res.status(200).render('users/register.ejs', {
                page: 'register',
                error: req.flash('errorMessage')
            });
        })

    router.route('/login')
        .get(authMiddleware.notAuthenticated, function(req, res) {

            res.status(200).render('users/login.ejs', {
                page: 'login',
                error: req.flash('loginMessage')
            });
        })
        .post(passport.authenticate('local-login', {
            successRedirect: '/profile',
            failureRedirect: '/profile/login',
            failureFlash: true
        }))

    router.route('/logout')
        .get(authMiddleware.isAuthenticated, function(req, res) {

            req.logout();
            res.redirect('/');
        })

    router.route('/register')
        .get(authMiddleware.notAuthenticated, function(req, res) {
            res.status(200).render('users/register.ejs', {
                page: 'register',
                error: req.flash('errorMessage')
            });
        })
        .post(passport.authenticate('local-signup', {
            successRedirect: '/profile/logout',
            failureRedirect: '/profile/register',
            failureFlash: true
        }))

    return router;
}

// function(app, passport) {

//     app.get('/profile/login', authenticateMiddleware.notAuthenticated, function(req, res) {

//         res.status(200).render('users/login.ejs', {
//             page: 'login',
//             error: req.flash('loginMessage')
//         });
//     });

//     app.post('/profile/login', passport.authenticate('local-login', {
//         successRedirect: '/profile',
//         failureRedirect: '/profile/login',
//         failureFlash: true
//     }));

//     app.get('/profile/logout', function(req, res) {
//         req.logout();
//         res.redirect('/');
//     });

//     app.get('/profile/register', authenticateMiddleware.notAuthenticated, function(req, res) {
//         res.status(200).render('users/register.ejs', {
//             page: 'register',
//             error: req.flash('errorMessage')
//         });
//     });

//     app.post('/profile/register', passport.authenticate('local-signup', {
//         successRedirect: '/profile/logout',
//         failureRedirect: '/profile/register',
//         failureFlash: true
//     }));

//     app.get('/profile', authenticateMiddleware.isAuthenticated, function(req, res) {

//         Routes.find({
//             Climber: req.user._id
//         }).exec(function(err, climbedRoutes) {
//             if (err)
//                 throw err;

//             res.status(200).render('routes/routeDetail.ejs', {
//                 routes: climbedRoutes,
//                 route: climbedRoutes[0]
//             });
//         });
//     });
// };