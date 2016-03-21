// load models
var mongoose = require('mongoose');
var Route = mongoose.model('Routes');

// Load middleware
var authenticateMiddleware = require('../middleware/authenticated');

module.exports = function(app) {

    app.get('/routes', function(req, res) {

        Route.find({}, function(err, routes) {
            res.status(200).send(routes);
        });
    });

    app.get('/routes/new', authenticateMiddleware.isAuthenticated, function(req, res) {
        res.render('routes/newRoute.ejs', {
            succes: req.flash('successMessage'),
            error: req.flash('errorMessage'),
            errorDetails: req.flash('errorDetails')
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

        console.log(newRoute);

        // validate route
        if(newRoute.validateSync()){
            req.flash('errorMessage', 'De ingevoerde gegevens zijn incorrect:');
            req.flash('errorDetails', newRoute.validateSync().toString()); 
            res.redirect('/routes/new');
        }

        // save route
        newRoute.save(function(err) {
            if (err){
                throw err;
            }

            req.flash('successMessage', 'Route is toegevoegd');
            res.redirect('/routes/new');
        });
    });

    // todo: add custom middle ware
    app.get('/routes/:id', function(req, res) {

        Route.find({
            'id': id
        }, function(err, route) {
            res.status(200).send(route);
        });
    });
};