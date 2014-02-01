'use strict';
var supertest = require('supertest');
var should = require('should');
var url = 'http://127.0.0.1:1200';
var api = supertest(url);
var request = require('request');
var Occurrence = require('../models/occurrence').model;

describe('Occurrence', function(){

  describe('POST /api/occurrences', function(){
    it('create a new occurrence', function(done) {
      var time = Date.now();
      api.post('/api/occurrences')
        .send({kind:"change", time:time})
        .expect(200)
        .end(function(err, res) {
          var result = res.body;
          result.should.have.property('status', "OK");
          
          // Integrated
          Occurrence.findOne({kind:"change", time:time}).exec(function(err, occs) {
            occs.remove(done);
          })
        });
    });
  });
  
  describe('GET /api/occurrences', function(){
    it('get all the occurrences', function(done) {
      var time = Date.now();
      api.get('/api/occurrences')
        .expect(200)
        .end(function(err, res) {
          var result = res.body;
          result.should.be.an.instanceOf(Array);
          
          // Integrated
          Occurrence.find({}).exec(function(err, occs) {
            result.should.have.length(occs.length);
            done()
          })
        });
    });
  });
  
});