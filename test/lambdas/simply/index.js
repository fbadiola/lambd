const Lambd = require('../../../src');

const okLambda = Lambd.create(({ response }) => response.json({ ok: true }));
const errorLambda = Lambd.create(({ response }) => response.error(new Error('This is a example error')));

module.exports.event = require('./event.json');
module.exports.okLambdaHandler = okLambda.getHandler();
module.exports.errorLambdaHandler = errorLambda.getHandler();
