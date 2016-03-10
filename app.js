var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var flashify = require('flashify');
var supertest = require("supertest");

// App
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

//connect to DB
var configDB = require('./config/database.js');
/* istanbul ignore else: only test test database */
if (process.env.HOME == "test") {
    mongoose.connect(configDB.testurl);
} else {
    mongoose.connect(configDB.url);
}

// view engine setup
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
/* istanbul ignore if: the disabled logger */
if (process.env.HOME != "test") {
    app.use(logger('dev'));
}

app.use(cookieParser('mciketisdabomb'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(flash());

//Authentication
app.set('trust proxy', 1);
app.use(session({
    secret: 'Mickaeltjeiseen kei',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 3600000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport
require('./config/passport')(passport);

// Models
require('./app/models/userModel');
require('./app/models/routesModel');

// Middleware
require('./app/routes/middleware')(app);

// Routes
require('./app/routes/index')(app);
require('./app/routes/users')(app, passport);
require('./app/routes/routes')(app);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
/* istanbul ignore next */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;