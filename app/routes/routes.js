// load models
var mongoose = require('mongoose');
var Route = mongoose.model('Routes');

// Load middleware
var authenticateMiddleware = require('../middleware/authenticated');

// Async
var async = require('async');

module.exports = function(app) {

    app.get('/routes', function(req, res) {

        Route.find({}, function(err, routes) {
            res.status(200).send(routes);
        });
    });

    app.post('/routes', authenticateMiddleware.isAuthenticated, function(req, res) {

        var newRoute = new Route();
        newRoute.Climber = req.user._id;
        newRoute.Name = req.body.Name;
        newRoute.Grade.France = req.body.Grade;
        newRoute.LeadClimbed = (req.body.LeadClimbed === 'on') ? true : false;
        newRoute.Outdoor = (req.body.Outdoor === 'on') ? true : false;
        newRoute.Rope = req.body.Rope;
        newRoute.Color = req.body.Color;

        // validate route
        if (newRoute.validateSync()) {
            req.flash('errorMessage', 'De ingevoerde gegevens zijn incorrect:');
            req.flash('errorDetails', newRoute.validateSync().toString());
            res.redirect('/routes/new');
        }

        // save route
        newRoute.save(function(err) {
            if (err)
                throw err;

            req.flash('successMessage', 'Route ' + newRoute.Name + ' is toegevoegd');
            res.redirect('/routes/new');
        });
    });

    app.get('/routes/new', authenticateMiddleware.isAuthenticated, function(req, res) {
        res.render('routes/newRoute.ejs', {
            success: req.flash('successMessage'),
            error: req.flash('errorMessage'),
            errorDetails: req.flash('errorDetails')
        });
    });

    app.get('/routes/:id', authenticateMiddleware.isAuthenticated, function(req, res) {
        async.parallel({
                route: function(callback) {
                    Route.findById(req.params.id, function(err, docs) {
                        callback(err, docs);
                    });
                },
                routes: function(callback) {
                    Route.find({
                        Climber: req.user._id
                    }, function(err, docs) {
                        callback(err, docs);
                    });
                },
            },
            function(err, out) {
                if (err) {
                    req.flash('errorMessage', 'Route kon niet worden gevonden');
                    res.redirect('/routes');
                }

                res.status(200).render('routes/routeDetail.ejs', {
                    routes: out.routes,
                    route: out.route
                });
            }
        );
    });

    app.delete('/routes/:id', authenticateMiddleware.mayTemperRoute, function(req, res) {
        Route.findById(req.params.id).remove(function(err, out) {
            if (err) {
                throw err;
                res.status(500).send('Server faalt, probeer het later nog eens');
            }

            res.send('De route is verwijderd!')

        });
    });
};