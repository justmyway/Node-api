module.exports = {

    isAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            res.redirect('/profile/login');
        } else {
            return next();
        }
    },

    notAuthenticated: function(req, res, next){
    	if(!req.isAuthenticated()){
    		return next();
    	}else{
    		res.redirect('/profile');
    	}
    }
};