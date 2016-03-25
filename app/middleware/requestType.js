module.exports = {

    isHTMLRequest: function(req, res, next) {
        if (req.accepts().indexOf('text/html') > -1) {
            req.flash('htmlCall', 'true');
        }
        console.log('temp');
        next();
    },

    isJSONRequest: function(req, res, next) {
        if (req.headers["x-requested-with"] == 'XMLHttpRequest') {
            req.flash('jsonCall', 'true');
        }
        next();
    }
};