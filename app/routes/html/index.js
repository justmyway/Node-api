// Load middleware
var requestMiddleware = require('../../middleware/requestType');

module.exports = function(app) {

    app.get('/', requestMiddleware.isHTMLRequest, function(req, res) {
        res.status(200).render('home/index.ejs');
    });
};