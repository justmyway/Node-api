// load models
var mongoose = require('mongoose');
var Routes = mongoose.model('Routes');

// Load middleware
var authenticateMiddleware = require('../middleware/authenticated');

module.exports = function(app) {

    app.get('/routes', function(req, res) {

        Routes.find({}, function(err, routes) {
            res.status(200).send(routes);
        });
    });

    // todo: add auth middle ware
    app.get('/routes/newRoute', function(req, res) {
        res.render('routes/newRoute.ejs');
    });

    // todo: add auth middle ware
    app.post('/routes', function(req, res) {

        var newRoute = new Routes();


    });

    // todo: add custom middle ware
    app.get('/routes/:id', function(req, res) {

        Routes.find({
            'id': id
        }, function(err, route) {
            res.status(200).send(route);
        });
    });
};