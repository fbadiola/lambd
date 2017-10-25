const Lambd = require('../../../src');

const okLambda = Lambd.create(({ response }) => response.json({ ok: true }));
const errorLambda = Lambd.create(({ response }) => response.error(new Error('This is a example error')));
const bodyLambda = Lambd.create(({ response, request }) => {
  const { body, headers, method, params, query } = request;
  response.json({
    ok: true,
    request: {
      body,
      headers,
      method,
      params,
      query
    }
  });
});

module.exports.event = require('./event.json');
module.exports.okLambdaHandler = okLambda.getHandler();
module.exports.errorLambdaHandler = errorLambda.getHandler();
module.exports.bodyLambdaHandler = bodyLambda.getHandler();
