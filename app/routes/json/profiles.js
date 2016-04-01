// Load routing
var express = require('express');
var router = express.Router();

// Load middleware
var jsonAuthMiddleware = require('../../middleware/jsonAuthentication');

// Load models
var mongoose = require('mongoose');
var Users = mongoose.model('User')

router.route('/')
	.all(jsonAuthMiddleware.isAdmin, function(req, res, next){
		next();
	})
    .get(function(req, res) {
        console.log('try');

        var queryString = req.url.split('?');
        routeQuery = {};
        if(queryString[1]){
            var query = queryString[1];
            query.split("&").forEach(function(part) {
                var item = part.split("=");
                routeQuery[item[0]] = item[1];
            });
        }

        Users.find(routeQuery, function(err, routes) {
            res.status(200).json(routes);
        });
    })
    .put(function(req, res){

    })
    .delete(function(req, res){
    	
    })

module.exports = router;