const Lambd = require('../../../src');

Lambd.set('AuthKey', '123456');
Lambd.set('Lambd-Enabled', 'true');

const defaultHeadersLambda = Lambd.create(({ response }) => response.json({ ok: true }));

module.exports.event = require('./event.json');
module.exports.defaultHeadersLambdaHandler = defaultHeadersLambda.getHandler();
