var assert = require('assert');

var request = require('supertest')
var app = require('../app.js')
var api = request(app)

describe('Test', function() {
    describe('#testing()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
});

describe('Routing', function() {
    describe('should enter correct paths', function() {
        it('/', function(done) {
            api
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200, done)
        });
    });

    describe('should not enter incorrect paths', function() {
        it('/thispagenotfound', function(done) {
            api
                .get('/thispagenotfound')
                .expect(404, done)
        });
    });
    /*describe('#callback()', function() {
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
    });*/
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