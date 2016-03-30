// Load routing
var express = require('express');
var router = express.Router();

// Load middleware
var authMiddleware = require('../../middleware/authenticated');

// Load models
var mongoose = require('mongoose');
var Route = mongoose.model('Routes');

router.route('/')
    .get(function(req, res) {

        res.render('routes/routes');
    })

module.exports = router;