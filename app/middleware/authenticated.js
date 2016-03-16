module.exports = {

    isAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            console.log('check isAuthenticated: false');
            res.redirect('profile/login');
        } else {
            console.log('check isAuthenticated: false');
            return next();
        }


    }
};