// Load routing
var express = require('express');
var router = express.Router();

router.route('/')
	.get(function(req, res) {
		res.status(200).render('home/index');
    })

module.exports = router;