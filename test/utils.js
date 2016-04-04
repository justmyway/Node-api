var config = require('../config/database');
var mongoose = require('mongoose');

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

// Load models
var mongoose = require('mongoose');
var Route = mongoose.model('Routes');
var User = mongoose.model('User');

beforeEach(function (done) {


  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return fillDB();
  }

  function fillDB() {
    var u = {
      Username: 'mickey',
      Name: 'Michael van de Ven',
      Email: 'Michael.vd.ven95@gamil.com',
      Password: 'testing',
      Roles: ['user', 'admin']
    };
    User.create(u, function(err, createdUser) {
      if (err)
        throw err;

      var route = {
        Climber: createdUser._id,
        Outdoor: true,
        LeadClimbed: true,
        Name: 'La dura dura',
        Grade: {
          France: '9b+'
        }
      };

      Route.create(route, function(err, createRoute) {
        if (err)
          throw err;

        return done();
      });
    });
  }


  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.testurl, function (err) {
      if (err) {
        throw err;
      }
      return clearDB();
    });
  } else {
    return clearDB();
  }

  
});


afterEach(function (done) {
  mongoose.disconnect();
  return done();
});