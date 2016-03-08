// load models
var mongoose = require('mongoose');
var Users = mongoose.model('User');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

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

    // app.get('/profile/register', function(req, res) {
    //     res.status(200).render('users/add.ejs', {
    //         page: 'register'
    //     });
    // });

    app.get('/profile/register', function(req, res) {
        console.log(req);
        console.log(req.flash('error1'));
        console.log(req.flash('error2'));
        console.log(req.flash('error'));
        console.log(req.flash());
        console.log(res.flash('error1'));
        console.log(res.flash('error2'));
        console.log(res.flash('error'));
        console.log(req.session.sessionFlash);
        res.status(200).render('users/add.ejs', {
            page: 'register',
            errorMessage: res.locals.sessionFlash,
            error: req.flash('error2')
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