// Load routing
var express = require('express');
var router = express.Router();

// Load middleware
var authMiddleware = require('../../middleware/authenticated');

// Load models
var mongoose = require('mongoose');
var Route = mongoose.model('Routes');

// Async
var async = require('async');

router.route('/')
    .get(authMiddleware.isAuthenticated, function(req, res) {

        res.render('routes/routes');
    })

router.route('/new')
	.get(authMiddleware.isAuthenticated, function(req, res) {
        res.render('routes/newRoute');
    })

router.route('/:id')
    .get(authMiddleware.isAuthenticated, function(req, res) {

        res.render('routes/routes');
    })

module.exports = router;