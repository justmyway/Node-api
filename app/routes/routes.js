// load models
var mongoose = require('mongoose');
var Routes = mongoose.model('Routes');
//var RoutesModel = require('../models/routesModel');

module.exports = function(app) {

	app.get('/routes', function(req, res){

		//var routes = new RoutesModel();

		res.status(200).end();
	});
};