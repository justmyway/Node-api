// Load routing
var express = require('express');
var router = express.Router();

// Load socket.io
// var http = require('http').Server(express);
// var io = require('socket.io')(http);

// Load middleware
var authMiddleware = require('../../middleware/authenticated');

// Load models
var mongoose = require('mongoose');
var Route = mongoose.model('Routes');

router.route('/')
	.all(authMiddleware.isAdmin, function(req, res, next) {
        next();
    })
    .get(function(req, res) {
        res.render('users/users', { layout: 'layouts/overviewLayout' });
    })

module.exports = router;