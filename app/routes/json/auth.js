// Load routing
var express = require('express');
var router = express.Router();

// Load middleware
var authMiddleware = require('../../middleware/jsonAuthentication');

// Load models
var mongoose = require('mongoose');
var Users = mongoose.model('User');

module.exports = function(passport){

    router.route('/facebook/callback')
        .get(passport.authenticate('facebook-login', {
            failureRedirect: '/profile/login',
            failureFlash: true
        }),
        function(req, res){
        	res.redirect('/routes/new');
        })

    router.route('/google/callback')
        .get(passport.authenticate('google-login', {
            failureRedirect: '/profile/login',
            failureFlash: true
        }),
        function(req, res){
        	res.redirect('/routes/new');
        })

    return router;
}