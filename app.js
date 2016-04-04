//var express = require('express');
var express = require('express.io');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var expressLayouts = require('express-ejs-layouts');

// App
var app = express();
app.http().io();

// Models
require('./app/models/userModel');
require('./app/models/routesModel');

// routes require
// html
var htmlPath = './app/routes/html/';
var htmlIndex = require(htmlPath + 'index');
var htmlRoutes = require(htmlPath + 'routes');
var htmlUsers = require(htmlPath + 'users')(passport);
var htmlProfiles = require(htmlPath + 'profiles');
var htmlAuth = require(htmlPath + 'auth')(passport);

//json
var jsonPath = './app/routes/json/';
var jsonRoutes = require(jsonPath + 'routes');
var jsonProfiles = require(jsonPath + 'profiles');
var jsonAuth = require(jsonPath + 'auth')(passport);

app.use(express.static('public'));

//connect to DB
var configDB = require('./config/database.js');
/* istanbul ignore else: only test test database */
if (process.env.HOME == "test") {
    mongoose.connect(configDB.testurl);
} else if (process.env.db_url) {
    mongoose.connect(process.env.db_url);
} else {
    mongoose.connect(configDB.url);
}

// view engine setup
app.set('view engine', 'ejs');
app.set('layout', 'layouts/listDetailLayout')
app.set("layout extractScripts", true)

app.use(expressLayouts);

// uncomment after placing your favicon in /public
if (process.env.db_url) {
    app.use(favicon(__dirname + '/public/images/favicon.ico'));
} else {
    app.use(favicon(__dirname + '\\public\\images\\favicon.ico'));
}
/* istanbul ignore if: the disabled logger */
if (process.env.HOME != "test") {
    app.use(logger('dev'));
}

app.use(cookieParser('Mickaeltjeiseen kei'));
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
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware
require('./app/middleware/middleware')(app);

// Passport
require('./config/passport')(passport);



// Routes
// HTML
app.use('/', htmlIndex);
app.use('/routes', htmlRoutes);
app.use('/profile', htmlUsers);
app.use('/users', htmlProfiles);
app.use('/auth', htmlAuth);

// JSON
app.use('/api/routes', jsonRoutes);
app.use('/api/users', jsonProfiles);
app.use('/api/auth', jsonAuth);

//io
require('./app/routes/json/ioProfiles')(app);



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