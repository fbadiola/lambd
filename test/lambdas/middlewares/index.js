const Lambd = require('../../../src');

const middlewareLambda = Lambd.create(({ response, config}) => response.json({ ok: true, config }));

middlewareLambda.use((next) => (options) => {
  options.config = { test: true };
  next(options);
});

Lambd.use((next) => (options) => {
  options.db = {
    find: () => ([{ id: 1 }, { id: 2 }])
  };
  next(options);
});

const predefinedMiddleware = Lambd.create(({ response, db }) => response.json({ ok: true, users: db.find() }));


module.exports.event = require('./event.json');
module.exports.middlewareLambdaHandler = middlewareLambda.getHandler();
module.exports.predefinedMiddleware = predefinedMiddleware.getHandler();
