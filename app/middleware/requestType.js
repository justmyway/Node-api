module.exports = {

    isHTMLRequest: function(req, res, next) {
        console.log(req.accepts('html'));
        console.log(req.accepts('json'));
        console.log(req.get('content-type'));
        // if (request.headers["x-requested-with"] == 'XMLHttpRequest') {
        //     next();
        // }
    },

    isJSONRequest: function(req, res, next) {
        if (request.headers["x-requested-with"] == 'XMLHttpRequest') {
            next();
        }
    }
};