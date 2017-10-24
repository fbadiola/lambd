const { expect } = require('chai');
const lambdaTester = require('lambda-tester');

const Lambd = require('../src');

const directly = require('./lambdas/directly');
const simply = require('./lambdas/simply');
const middlewares = require('./lambdas/middlewares');

describe('Create Lambd', () => {
  it('Get lambda instance', () => {
    const myLambda = Lambd.create(console.log);
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
})
