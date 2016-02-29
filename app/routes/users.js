// load models
var mongoose = require('mongoose');
var Users = mongoose.model('User');

module.exports = function(app) {

    app.get('/profile/login', function(req, res){

        res.status(200).render('users/login.ejs');
    });

    app.get('/profile', function(req, res){

        res.status(200).render('users/profile.ejs', {
            user: req.user
        });
    });
};