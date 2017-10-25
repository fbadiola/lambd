const Lambd = require('../../../src');

const myLambda =
  Lambd
    .create(({ response }) => response.status(404).error('not found'))
    .get(({ request, response }) => {
      return Promise.resolve({ ok: true, user: request.params.userid, sortedBy: request.query.sort });
    })
    .post(({ request, response }) => {
      return Promise.resolve({ ok: true, body: request.body });
    });

module.exports.event = {
  get: require('./events/get.json'),
  post: require('./events/post.json'),
  put: require('./events/put.json')
};

module.exports.handler = myLambda.getHandler();
