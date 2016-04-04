// import the moongoose helper utilities
var utils = require('../utils');
var should = require('should');
// import our User mongoose model
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Route = mongoose.model('Routes');


describe('Models', function () {

  describe('User', function () {
    it('should create a new User', function (done) {
      var u = {
        Username: 'mickeyy',
        Name: 'Michael van de Ven',
        Email: 'Michael.vd.ven955@gamil.com',
        Password: 'testing',
        Roles: ['user', 'admin']
      };
      User.create(u, function (err, createdUser) {
        // Confirm that that an error does not exist
        should.not.exist(err);
        // verify that the returned user is what we expect
        createdUser.Username.should.equal('mickeyy');
        createdUser.Name.should.equal('Michael van de Ven');
        // Call done to tell mocha that we are done with this test
        return done();
      });
    });

    it('should remove a User', function (done) {
      User.find({ "Username": "mickeyy" }).remove(function(err, out) {
        // Confirm that that an error does not exist
        should.not.exist(err);
        return done();
      });
    });
  });

});