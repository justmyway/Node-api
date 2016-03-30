// Load routing
var express = require('express');
var router = express.Router();

// Load middleware
var authMiddleware = require('../../middleware/authenticated');

// Load models
var mongoose = require('mongoose');
var Route = mongoose.model('Routes');

router.route('/')
	.all(authMiddleware, function(req, res, next) {

        next();
    })
    .get(function(req, res) {

        res.render('users/users');
    })

module.exports = router;