// Load routing
var express = require('express');
var router = express.Router();

// Load middleware
var requestMiddleware = require('../../middleware/requestType');

router.route('/')
	.all(requestMiddleware.isHTMLRequest, function(req, res, next){
		next();
	})
	.get(function(req, res, next) {

		if(req.flash('htmlCall') == 'true')
        	res.status(200).render('home/index.ejs');
		
		next();
    })

module.exports = router;