const Lambd = require('../../../src');
const handler = ({ response }) => response.json({ ok: true });
const myLambda = Lambd.create(handler);

module.exports.event = require('./event.json');
module.exports.handler = myLambda.getHandler();
