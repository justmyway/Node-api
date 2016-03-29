// load models
var mongoose = require('mongoose');
var Route = mongoose.model('Routes');

module.exports = {

    isAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.status(401).send('Je bent niet ingelogt.');
        }
    },

    notAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            res.status(401).redirect('/profile');
        }
    },

    mayTemperRoute: function(req, res, next) {
        if (req.isAuthenticated()) {

            if (req.user.Roles.length > 0 && req.user.Roles.contains("admin"))
                return next();

            Route.findById(req.params.id, 'Climber').exec(function(err, route) {
                if (err)
                    throw err;

                if (String(route.Climber) == String(req.user._id)) {
                    return next();
                } else {
                    res.status(403).send('Je hebt geen rechten aanpassingen aan deze route te maken.');
                }
            });
        } else {
            res.status(401).send('Je bent niet ingeloched.');
        }
    }
};