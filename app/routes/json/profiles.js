// Load routing
var express = require('express');
var router = express.Router();

// Load middleware
var jsonAuthMiddleware = require('../../middleware/jsonAuthentication');

// Load models
var mongoose = require('mongoose');
var Users = mongoose.model('User')

/* istanbul ignore next */
router.route('/')
    .all(jsonAuthMiddleware.isAdmin, function(req, res, next){
		next();
	})
    .get(function(req, res) {

        var queryString = req.url.split('?');
        routeQuery = {};
        if(queryString[1]){
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
    .all(jsonAuthMiddleware.isAdmin, function(req, res, next){
        next();
    })
    .get(function(req, res) {

        User.findById(req.params.id, "-Password" , function(err, reqUser) {
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
            if(req.body.Google == 'false')
                out.Google = undefined;
            
            if(req.body.Facebook == 'false')
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

module.exports = router;