process.env.HOME = "test";

var assert = require('assert');

var request = require('supertest')
var app = require('../app.js')
var api = request(app)

describe('Routing', function() {
    it('/', function(done) {
        api
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200, done)
    });

    it('/routes', function(done) {
        api
            .get('/routes')
            .expect('Content-Type', /html/)
            .expect(200, done)
    });

    it('/thispagenotfound', function(done) {
        api
            .get('/thispagenotfound')
            .expect(404, done)
    });
});

/*describe('Database', function() {
    describe('#save()', function() {
        it('save user to database', function(done) {
            var collection = db.get('userlist');
            var user = {
                username: 'Michael',
                fullname: 'Michael van de Ven',
                email: 'Michael@gmail.com'
            };
            collection.insert(user, function(err, result) {
                if (err) throw err;
                done();
            });
        });
    });
});*/