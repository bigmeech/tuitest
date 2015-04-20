var request = require('supertest');
var app = require('../app');

var userReqBody = {
    _id:"5534e630ff68fbd81f7ed9a9",
    email:"larry.eliemenye@gmail.com",
    firstname:'larry',
    lastname:'eliemenye',
    bio:'i am very tall',
    password:"winteriscoming"
};

describe("routes", function(){
    it("/ should respond to GET requests", function(done){
        request(app)
            .get('/')
            .expect(200, done)
    });
    it("/api/users/ should respond to POST requests", function(done){
        request(app)
            .post('/api/users')
            .send(userReqBody)
            .set('Accept', 'application/json')
            .expect(200, done)
    });
    it("/ should fail for POST requests", function(done){
        request(app)
            .post('/')
            .expect(404, done)
    });
    it("/ should fail for PUT requests", function(done){
        request(app)
            .put('/')
            .expect(404, done)
    });
    it("/ should respond with a 404 to POST requests", function(done){
        request(app)
            .post('/')
            .expect(404, done)
    });
    it("/ should respond back with a html content", function(done){
        request(app)
            .get('/')
            .expect('Content-type', /html/)
            .expect(200, done)
    });

    it("/api/users/ should respond back with a json content", function(done){
        request(app)
            .get('/api/users')
            .send()
            .expect('Content-type', /json/)
            .expect(200, done)
    });

    it("/api/users/ should respond to delete request", function(done){
        request(app)
            .delete('/api/users')
            .query({id:userReqBody._id})
            .expect('Content-type', /json/)
            .expect(200, done)
    })
});
