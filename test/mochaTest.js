process.env.HOME = "test";

var assert = require('assert');

var request = require('supertest');
var app = require('../app.js');
var api = request(app)

// Load models
var mongoose = require('mongoose');
var Route = mongoose.model('Routes');
var User = mongoose.model('User');

var routes = require('./routes/test.js');
var models = require('./models/test.js');