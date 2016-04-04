process.env.HOME = "test";

var assert = require('assert');

var passportStub = require('passport-stub');
var request = require('supertest');
var app = require('../../app.js');
var api = request(app);
passportStub.install(app);

// Load models
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Route = mongoose.model('Routes');

describe('Routing', function() {
    describe('Page', function() {
        it('/', function(done) {
            api
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200, done)
        });

        it('/profile', function(done) {
            api
                .get('/profile')
                .expect(302, done)
        });

        it('/profile/login', function(done) {
            api
                .get('/profile/login')
                .expect(200, done)
        });

        it('/profile/logout', function(done) {
            api
                .get('/profile/logout')
                .expect(302, done)
        });

        it('/profile/register', function(done) {
            api
                .get('/profile/register')
                .expect(200, done)
        });

        it('/auth/facebook', function(done) {
            api
                .get('/auth/facebook')
                .expect(302, done)
        });

        it('/auth/google', function(done) {
            api
                .get('/auth/google')
                .expect(302, done)
        });

        it('/routes', function(done) {
            api
                .get('/routes')
                .expect(302, done)
        });

        it('/routes/new', function(done) {
            api
                .get('/routes/new')
                .expect(302, done)
        });

        it('/routes/fakeId', function(done) {
            api
                .get('/routes/new')
                .expect(302, done)
        });

        it('/auth/google', function(done) {
            api
                .get('/auth/google')
                .expect(302, done)
        });

        it('/auth/facebook', function(done) {
            api
                .get('/auth/facebook')
                .expect(302, done)
        });

        it('/thispagenotfound', function(done) {
            api
                .get('/thispagenotfound')
                .expect(404, done)
        });
    });

    describe('Api', function() {

        it('/api/routes unauth POST', function(done) {
            api
                .post('/api/routes')
                .send({
                    Outdoor: true,
                    Name: 'La dura dura',
                    LeadClimbed: true,
                    Grade: {
                        France: '9b+'
                    },
                })
                .expect('Content-Type', /html/)
                .expect(401, done)
        });

        it('/api/routes/test unauth PUT', function(done) {
            api
                .put('/api/routes/test')
                .send({
                    Outdoor: true,
                    Name: 'La dura dura',
                    LeadClimbed: true,
                    Grade: {
                        France: '9b+'
                    },
                })
                .expect('Content-Type', /html/)
                .expect(410, done)
        });

        it('/api/routes/test unauth REMOVE', function(done) {
            api
                .delete('/api/routes/test')
                .send({
                    Outdoor: true,
                    Name: 'La dura dura',
                    LeadClimbed: true,
                    Grade: {
                        France: '9b+'
                    },
                })
                .expect('Content-Type', /html/)
                .expect(410, done)
        });

        it('/api/routes unauth', function(done) {
            api
                .get('/api/routes')
                .expect('Content-Type', /json/)
                .expect(200, done)
        });

        it('/api/users unauth', function(done) {
            api
                .get('/api/users')
                .expect('Content-Type', /html/)
                .expect(403, done)
        });

        it('/api/users/test unauth PUT', function(done) {
            api
                .put('/api/users/test')
                .send({
                    Username: 'mickey',
                    Name: 'Michael van de Ven',
                    Email: 'michael.vd.ven@gmail.com'
                })
                .expect('Content-Type', /html/)
                .expect(403, done)
        });

        it('/api/users/test unauth REMOVE', function(done) {
            api
                .delete('/api/users/test')
                .send({
                    Username: 'mickey',
                    Name: 'Michael van de Ven',
                    Email: 'michael.vd.ven@gmail.com'
                })
                .expect('Content-Type', /html/)
                .expect(403, done)
        });

        // it('/api/users auth', function(done) {
        //     passportStub.login({ Username: 'mickey'});
        //     api
        //         .get('/api/users')
        //         .expect('Content-Type', /html/)
        //         .expect(403, done)
        // });

        // it('/api/routes auth', function(done) {
        //     passportStub.login({ Username: 'mickey'});
        //     api
        //         .get('/api/routes')
        //         .expect('Content-Type', /html/)
        //         .expect(403, done)
        // });

        // it('/api/users unauth', function(done) {
        //     passportStub.login({Username: 'mickey'});
        //     api
        //         .get('/api/users')
        //         .expect('Content-Type', /html/)
        //         .expect(403, done)
        // });

        // it('/api/users auth', function(done) {
        //     User.find({'Username': 'mickey'}, function (err, user) {
        //         console.log(err);
        //         console.log(user);
        //         passportStub.login(user);
        //         api
        //             .get('/api/users')
        //             .expect('Content-Type', /html/)
        //             .expect(403, done)
        //     });
        // });

        
    });
});