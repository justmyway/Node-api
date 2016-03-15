module.exports = {

	isAuthenticated: function(req, res, next){
		// if(req.isAuthenticated())
		// 	res.redirect('profile/login');

		return next();
	}
};