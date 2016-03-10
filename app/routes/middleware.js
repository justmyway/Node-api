module.exports = function(app) {

	// User to view
	app.use(function(req, res, next){
		console.log('check login');
		console.log(req.session.passport);
		//console.log(req.user);

		res.locals.user = 'req.user';

		next();
	});
};