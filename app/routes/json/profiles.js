// Load routing
var express = require('express');
var router = express.Router();

// Load middleware
var jsonAuthMiddleware = require('../../middleware/jsonAuthentication');

// Load models
var mongoose = require('mongoose');
var Users = mongoose.model('User')
var Routes = mongoose.model('Routes')

/* istanbul ignore next */
router.route('/')
    .all(jsonAuthMiddleware.isAdmin, function(req, res, next) {
        next();
    })
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

        Users.find(routeQuery, function(err, routes) {
            res.status(200).json(routes);
        });
    })

/* istanbul ignore next */
router.route('/:id')
    .all(jsonAuthMiddleware.isAdmin, function(req, res, next) {
        next();
    })
    .get(function(req, res) {

        User.findById(req.params.id, "-Password", function(err, reqUser) {
            res.json(reqUser);
        });
    })
    .delete(function(req, res) {

        User.findById(req.params.id).remove(function(err, out) {
            if (err)
                return res.status(500).send('Server faalt, probeer het later nog eens');

            res.status(200).send('De gebruiker is verwijderd!')

        });
    })
    .put(function(req, res) {

        User.findById(req.params.id, function(err, out) {
            if (err)
                return res.status(500).send('Server faalt, probeer het later nog eens');

            out.Name = req.body.Name;
            out.Email = req.body.Email;
            out.Username = req.body.Username;
            out.Roles = req.body.Roles;
            if (req.body.Google == 'false')
                out.Google = undefined;

            if (req.body.Facebook == 'false')
                out.Facebook = undefined;

            out.Meta.Modified = new Date();

            // validate route
            if (out.validateSync())
                res.status(406).send('Gegevens incorrect:' + out.validateSync().toString());

            // save route
            out.save(function(err) {
                if (err)
                    res.status(500).send(err.message);

                res.status(201).send('De gebruiker "' + out.Username + '" is aangepast!');
            });

        });
    })

router.route('/:appid/routes')
    .all(function(req, res, next) {
        //todo:
        //alle reequests hier graag loggen

        User.findOne({
            "AppID": req.params.appid
        }, function(err, user) {
            if (err)
                return res.status(404).send('Niet gevonden');

            req.user = user

            next();
        });
    })
    .get(function(req, res, next) {
        Routes.find({
            "Climber": req.user._id
        }).sort('-Meta.Created').exec(function(err, routes) {
            if (err)
                return res.status(404).send('Niet gevonden');

            res.status(200).json(routes);
        });
    })
    .post(function(req, res, next) {

        var newRoute = new Route();
        newRoute.Climber = req.user._id;
        newRoute.Name = req.body.Name;
        newRoute.Grade.France = req.body.Grade.France;
        newRoute.Grade.Usa = req.body.Grade.Usa;
        newRoute.Grade.German = req.body.Grade.German;
        newRoute.LeadClimbed = req.body.LeadClimbed;
        newRoute.Outdoor = req.body.Outdoor;
        newRoute.Rope = req.body.Rope;
        newRoute.Color = req.body.Color;
        newRoute.Location.Longitude = req.body.Location.Longitude;
        newRoute.Location.Latitude = req.body.Location.Latitude;
        newRoute.Location.Accuracy = req.body.Location.Accuracy;
        newRoute.Meta.Climbed = req.body.Climbed;

        console.log(newRoute);

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

module.exports = router;