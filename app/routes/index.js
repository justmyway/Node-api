module.exports = function(app) {

    // GET home page
    app.get('/', function(req, res) {
        res.status(200).render('index/index.ejs');
    });
};