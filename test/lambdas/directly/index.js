module.exports.event = require('./event.json');
module.exports.handler = (event, context) => context.succeed({
  body: JSON.stringify({ ok: true })
});
