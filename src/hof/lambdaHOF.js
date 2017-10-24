const Response = require('../Response');
const Request = require('../Request');

const lambdaHOF = (fn) => (event, ctx) => {
  const request = new Request(event);
  const response = new Response(ctx);

  return fn({
    event,
    ctx,
    request,
    response
  });
};

module.exports = lambdaHOF;
