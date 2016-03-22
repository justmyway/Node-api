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
            success: req.flash('successMessage'),
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

        // validate route
        if(newRoute.validateSync()){
            req.flash('errorMessage', 'De ingevoerde gegevens zijn incorrect:');
            req.flash('errorDetails', newRoute.validateSync().toString()); 
            res.redirect('/routes/new');
        }

        // save route
        newRoute.save(function(err) {
            if (err)
                throw err;

            req.flash('successMessage', 'Route '+ newRoute.Name +' is toegevoegd');
            res.redirect('/routes/new');
        });
    });

    app.get('/routes/:id', function(req, res) {
        Route.findById(req.params.id).exec(function(err, route) {
            console.log(err);
            console.log(route);
            if (err){
                req.flash('errorMessage', 'Route kon niet worden gevonden');
                res.redirect('/routes');
            }

            res.status(200).send(route);
        });
    });
};