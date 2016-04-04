// load models
var mongoose = require('mongoose');
var Route = mongoose.model('Routes');
var User = mongoose.model('User');

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

    isAdmin: function(req, res, next) {
        if(req.user.hasAnyRole('admin')){
            return next();
        }else{
            return res.status(403).send('Je moet een admin zijn om hier te komen.');
        }
    },

    mayTemperRoute: function(req, res, next) {
        if (req.isAuthenticated()) {

            console.log(req.user);
            console.log(req.user.hasAnyRole());

            if (req.user.hasAnyRole("admin"))
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