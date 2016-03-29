// Load routing
var express = require('express');
var router = express.Router();

// load models
var mongoose = require('mongoose');
var Route = mongoose.model('Routes');
var User = mongoose.model('User')

// Load middleware
var jsonAuth = require('../../middleware/jsonAuthentication');

// Async
var async = require('async');

//todo:
//alle outheticatie bijwerken zodat hier geen rechten fouten in ontstaan

router.route('/')
    .get(function(req, res) {

        Route.find({}, function(err, routes) {
            res.status(200).json(routes);
        });
    })

router.route('/:id')
    //.get(jsonAuth.isAuthenticated, function(req, res) {
    .get(function(req, res) {

        //https://maps.googleapis.com/maps/api/geocode/json?location=49.8208,6.3486&key=AIzaSyD6XPbtiBTAzA-iCGzq5OlYQ7U_k7fd3SY

        async.parallel({
                route: function(callback) {
                    Route.findById(req.params.id, function(err, docs) {
                        callback(err, docs);
                    });
                },
                /*routes: function(callback) {
                    Route.find({
                        Climber: req.user._id
                    }, function(err, docs) {
                        callback(err, docs);
                    });
                },*/
            },
            function(err, out) {
                if (err)
                    res.json(err);

                res.json(out.route);
            }
        );
    })
    //.delete(isAuthenticated.mayTemperRoute, function(req, res) {
    .delete(function(req, res) {

        Route.findById(req.params.id).remove(function(err, out) {
            if (err) {
                throw err;
                return res.status(500).send('Server faalt, probeer het later nog eens');
            }

            res.send('De route is verwijderd!')

        });
    });

module.exports = router;

// module.exports = function(app) {

//     app.get('/routes', function(req, res) {

//         Route.find({}, function(err, routes) {
//             res.status(200).send(routes);
//         });
//     });

//     app.post('/routes', authenticateMiddleware.isAuthenticated, function(req, res) {

//         var newRoute = new Route();
//         newRoute.Climber = req.user._id;
//         newRoute.Name = req.body.Name;
//         newRoute.Grade.France = req.body.Grade;
//         newRoute.LeadClimbed = (req.body.LeadClimbed === 'on') ? true : false;
//         newRoute.Outdoor = (req.body.Outdoor === 'on') ? true : false;
//         newRoute.Rope = req.body.Rope;
//         newRoute.Color = req.body.Color;

//         // validate route
//         if (newRoute.validateSync()) {
//             req.flash('errorMessage', 'De ingevoerde gegevens zijn incorrect:');
//             req.flash('errorDetails', newRoute.validateSync().toString());
//             res.redirect('/routes/new');
//         }

//         // save route
//         newRoute.save(function(err) {
//             if (err)
//                 throw err;

//             req.flash('successMessage', 'Route ' + newRoute.Name + ' is toegevoegd');
//             res.redirect('/routes/new');
//         });
//     });

//     app.get('/routes/new', authenticateMiddleware.isAuthenticated, function(req, res) {
//         res.render('routes/newRoute.ejs', {
//             success: req.flash('successMessage'),
//             error: req.flash('errorMessage'),
//             errorDetails: req.flash('errorDetails')
//         });
//     });

//     app.get('/routes/:id', authenticateMiddleware.isAuthenticated, function(req, res) {

//         //https://maps.googleapis.com/maps/api/geocode/json?location=49.8208,6.3486&key=AIzaSyD6XPbtiBTAzA-iCGzq5OlYQ7U_k7fd3SY

//         async.parallel({
//                 route: function(callback) {
//                     Route.findById(req.params.id, function(err, docs) {
//                         callback(err, docs);
//                     });
//                 },
//                 routes: function(callback) {
//                     Route.find({
//                         Climber: req.user._id
//                     }, function(err, docs) {
//                         callback(err, docs);
//                     });
//                 },
//             },
//             function(err, out) {
//                 if (err) {
//                     req.flash('errorMessage', 'Route kon niet worden gevonden');
//                     res.redirect('/routes');
//                 }

//                 res.status(200).render('routes/routeDetail.ejs', {
//                     routes: out.routes,
//                     route: out.route
//                 });
//             }
//         );
//     });

//     app.delete('/routes/:id', authenticateMiddleware.mayTemperRoute, function(req, res) {

//         Route.findById(req.params.id).remove(function(err, out) {
//             if (err) {
//                 throw err;
//                 res.status(500).send('Server faalt, probeer het later nog eens');
//             }

//             res.send('De route is verwijderd!')

//         });
//         res.send('De route is verwijderd!')
//     });
// };