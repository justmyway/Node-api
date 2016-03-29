module.exports = function(app) {

    // User to view
    app.use(function(req, res, next) {
        res.locals.user = req.user;
        next();
    });

    //request type api
    app.use(function(req, res, next){
    	if (req.get('x-requested-with') === 'XMLHttpRequest' && req.url.substring(0,4) != '/api') {
    		return res.redirect('/api' + req.url);
    	}else{
            next();
        }
    });
};