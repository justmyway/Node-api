// Load routing
var express = require('express');
var router = express.Router();

// load models
var mongoose = require('mongoose');
var Route = mongoose.model('Routes');
var User = mongoose.model('User');

// Load middleware
var jsonAuth = require('../../middleware/jsonAuthentication');

// Async
var async = require('async');
var http = require('http');
var request = require('request');

router.route('/')
    .get(function(req, res) {

        var queryString = req.url.split('?');
        routeQuery = {};
        if (queryString[1]) {
            var query = queryString[1];
            query.split("&").forEach(function(part) {
                var item = part.split("=");
                routeQuery[item[0]] = item[1];
            });
        }

        Route.find(routeQuery).sort('-Meta.Created').exec(function(err, routes) {
            res.status(200).json(routes);
        });
    })
    .post(jsonAuth.isAuthenticated, function(req, res) {

        var newRoute = new Route();
        newRoute.Climber = req.user._id;
        newRoute.Name = req.body.Name;
        newRoute.Grade.France = req.body.Grade;
        newRoute.LeadClimbed = req.body.LeadClimbed;
        newRoute.Outdoor = req.body.Outdoor;
        newRoute.Rope = req.body.Rope;
        newRoute.Color = req.body.Color;

        // validate route
        if (newRoute.validateSync())
            res.status(406).send('Gegevens incorrect:' + newRoute.validateSync().toString());

        // save route
        newRoute.save(function(err) {
            if (err)
                res.status(500).send(err);

            res.status(201).send('Route "' + newRoute.Name + '" is toegevoegd.');
        });
    })

/* istanbul ignore next */
router.route('/:id')
    .all(function(req, res, next) {
        Route.findById(req.params.id, function(err, out) {
            if (err)
                return res.status(410).send('Helaas deze route bestaat niet');

            out.Meta.LastVisited = new Date();

            // save route
            out.save(function(err) {
                if (err)
                    res.status(500).send(err);

                next();
            });
        });
    })
    .get(jsonAuth.isAuthenticated, function(req, res) {

        async.parallel({
                route: function(callback) {
                    Route.findById(req.params.id, function(err, docs) {
                        callback(err, docs);
                    });
                },
                climbers: function(callback) {
                    User.find({}, "Name").lean().exec(function(err, docs) {
                        callback(err, docs);
                    });
                },
            },
            function(err, out) {
                if (err)
                    res.json(err);

                var theRoute = out.route.toObject();

                for (var i = 0; i < out.climbers.length; i++) {
                    if (String(theRoute.Climber) == String(out.climbers[i]['_id'])) {
                        theRoute.ClimberName = String(out.climbers[i]['Name']);
                        break;
                    }
                }

                var location = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=';
                if(out.route.Location && out.route.Location.Longitude.length > 0){
                    location += out.route.Location.Longitude + ',';
                    location += out.route.Location.Latitude;
                }else{
                    location += '50.484545,';
                    location += '4.9427051';
                }
                location += '&sensor=false';

                request({
                    url: location,
                    json: true
                }, function(err, result, data) {
                    console.log(data);

                    if (err)
                        res.json(theRoute);

                    if (data.results[0].formatted_address)
                        theRoute.LocationArea = String(data.results[0].formatted_address);

                    res.json(theRoute);
                })
            }
        );
    })
    .delete(jsonAuth.mayTemperRoute, function(req, res) {

        Route.findById(req.params.id).remove(function(err, out) {
            if (err)
                return res.status(500).send('Server faalt, probeer het later nog eens');

            res.status(200).send('De route is verwijderd!')

        });
    })
    .put(jsonAuth.mayTemperRoute, function(req, res) {

        Route.findById(req.params.id, function(err, out) {
            if (err)
                return res.status(500).send('Server faalt, probeer het later nog eens');

            out.Name = req.body.Name;
            out.Grade.France = req.body.Grade;
            out.LeadClimbed = req.body.LeadClimbed;
            out.Outdoor = req.body.Outdoor;
            out.Rope = req.body.Rope;
            out.Color = req.body.Color;
            out.Meta.LastVisited = new Date();
            out.Meta.Modified = new Date();

            // validate route
            if (out.validateSync())
                res.status(406).send('Gegevens incorrect:' + out.validateSync().toString());

            // save route
            out.save(function(err) {
                if (err)
                    res.status(500).send(err);

                res.status(201).send('De route is aangepast!');
            });

        });
    });

module.exports = router;