module.exports = function(app) {

    // User to view
    app.use(function(req, res, next) {
        res.locals.user = req.user;
        next();
    });
};