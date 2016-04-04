// Load routing
var express = require('express');
var router = express.Router();

// Load middleware
var authMiddleware = require('../../middleware/authenticated');

// Load models
var mongoose = require('mongoose');
var Users = mongoose.model('User');

module.exports = function(passport){

    router.route('/facebook')
        .get(authMiddleware.notAuthenticated, passport.authenticate('facebook-login'))

    router.route('/google')
        .get(authMiddleware.notAuthenticated, passport.authenticate('google-login', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] }))


    return router;
}