const { expect } = require('chai');
const lambdaTester = require('lambda-tester');

const Lambd = require('../src');

const directly = require('./lambdas/directly');
const simply = require('./lambdas/simply');
const middlewares = require('./lambdas/middlewares');
const headers = require('./lambdas/headers');
const api = require('./lambdas/api');

describe('Create Lambd', () => {
  it('Get lambda instance', () => {
    const myLambda = Lambd.create();
    expect(myLambda).to.be.an.instanceof(Lambd.Lambda);
  });

  it('Call directly handler', (done) => {
    lambdaTester(directly.handler)
      .event(directly.event)
      .expectSucceed(function(response) {
        const data = JSON.parse(response.body);
        expect(data.ok).to.be.a('boolean');
      })
      .verify(done);
  });

  it('Call simply lambd handler with OK', (done) => {
    lambdaTester(simply.okLambdaHandler)
      .event(simply.event)
      .expectSucceed(function(response) {
        const data = JSON.parse(response.body);
        expect(data.ok).to.be.a('boolean');
      })
      .verify(done);
  });

  it('Call simply lambd handler with Error', (done) => {
    lambdaTester(simply.errorLambdaHandler)
      .event(simply.event)
      .expectSucceed(function(response) {
        const data = JSON.parse(response.body);
        expect(data.message).to.not.be.undefined;
        expect(response.statusCode).to.not.equal(200);
      })
      .verify(done);
  });

  it('Call simply lambd handler: Request fields', (done) => {
    lambdaTester(simply.bodyLambdaHandler)
      .event(simply.event)
      .expectSucceed(function(response) {
        const data = JSON.parse(response.body);
        expect(data.ok).to.be.equal(true);
        // Request
        expect(data.request).to.not.be.undefined;
        expect(data.request.body).to.not.be.undefined;
        expect(data.request.body.email).to.not.be.undefined;
        expect(data.request.body.email).to.be.equal('new.mail@myuser.com');
        // Headers
        expect(data.request.headers).to.not.be.undefined;
        expect(data.request.headers['User-Agent']).to.not.be.undefined;
        expect(data.request.headers['User-Agent']).to.be.equal('node-superagent/1.2.0');
        // QS
        expect(data.request.query).to.not.be.undefined;
        expect(data.request.query).to.be.a('object');
        expect(data.request.query).to.be.empty;
        // Path params
        expect(data.request.params).to.not.be.undefined;
        expect(data.request.params).to.be.a('object');
        expect(data.request.params).to.not.be.empty;
        expect(data.request.params).to.have.own.property('userid').equal('1');
        // method
        expect(data.request.method).to.not.be.undefined;
        expect(data.request.method).to.be.a('string');
        expect(data.request.method).to.be.equal('PUT');
      })
      .verify(done);
  });

  it('Call lambd handler with middlewares', (done) => {
    lambdaTester(middlewares.middlewareLambdaHandler)
      .event(middlewares.event)
      .expectSucceed(function(response) {
        const data = JSON.parse(response.body);
        expect(data.ok).to.be.a('boolean');
        expect(data.config).to.be.an('object');
        expect(data.config.test).to.be.equal(true);
      })
      .verify(done);
  });

  it('Call lambd handler with predefined middlewares', (done) => {
    lambdaTester(middlewares.predefinedMiddleware)
      .event(middlewares.event)
      .expectSucceed(function(response) {
        const data = JSON.parse(response.body);
        expect(data.ok).to.be.a('boolean');
        expect(data.users).to.be.an('array');
        expect(data.users).to.have.lengthOf(2);
      })
      .verify(done);
  });

  it('Call lambd handler with default headers', (done) => {
    lambdaTester(headers.defaultHeadersLambdaHandler)
      .event(headers.event)
      .expectSucceed(function(response) {
        const data = JSON.parse(response.body);
        expect(data.ok).to.be.a('boolean');
        expect(response.headers.AuthKey).to.be.equal('123456');
        expect(response.headers['Lambd-Enabled']).to.be.equal('true');
      })
      .verify(done);
  });

  it('Call api lambds: GET', (done) => {
    lambdaTester(api.handler)
      .event(api.event.get)
      .expectSucceed(function(response) {
        const data = JSON.parse(response.body);
        expect(response.statusCode).to.be.equal(200);
        expect(data.ok).to.be.a('boolean');
        expect(data.user).to.be.equal('1');
      })
      .verify(done);
  });

  it('Call api lambds: POST', (done) => {
    lambdaTester(api.handler)
      .event(api.event.post)
      .expectSucceed(function(response) {
        const data = JSON.parse(response.body);
        expect(response.statusCode).to.be.equal(200);
        expect(data.ok).to.be.a('boolean');
      })
      .verify(done);
  });

  it('Call api lambds: PUT doesnt exists', (done) => {
    lambdaTester(api.handler)
      .event(api.event.put)
      .expectSucceed(function(response) {
        const data = JSON.parse(response.body);
        expect(response.statusCode).to.be.equal(404);
        expect(data.message).to.be.an('string');
      })
      .verify(done);
  });
})
