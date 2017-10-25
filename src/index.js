const Lambda = require('./Lambda');
const Response = require('./Response');

const middlewares = [];

const create = fn => new Lambda(fn, { middlewares });

const use = middleware => {
  middlewares.push(middleware);
  return Lambd;
};

const set = (key, value) => {
  Response.setDefaultHeaders(key, value);
};

const Lambd = {
  create,
  use,
  set,
};

module.exports = Lambd;
module.exports.Lambda = Lambda;
