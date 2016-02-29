// load models
var mongoose = require('mongoose');
var Routes = mongoose.model('Routes');

module.exports = function(app) {

	app.get('/routes', function(req, res){

		Routes.find({}, function(err, routes){
		    res.status(200).send(routes);  
	 	});
	});

	app.post('/routes', function(req, res){

		var newRoute = new Routes();

		
	});

	app.get('/routes/:id', function(req, res){

		Routes.find({ 'id': id}, function(err, route){
			res.status(200).send(route);
		});
	});
};