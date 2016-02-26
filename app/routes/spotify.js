module.exports = function(app) {

    // spotify callback
    app.get('/callback/spotify', function(req, res) {
        res.status(200).render('index/index.ejs');
    });
};