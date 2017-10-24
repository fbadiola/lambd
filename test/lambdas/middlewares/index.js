const Lambd = require('../../../src');

const middlewareLambda = Lambd.create(({ response, config}) => response.json({ ok: true, config }));

middlewareLambda.use((next) => (options) => {
  options.config = { test: true };
  next(options);
});

module.exports.event = require('./event.json');
module.exports.middlewareLambdaHandler = middlewareLambda.getHandler();
