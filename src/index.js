const Lambda = require('./Lambda');

const middlewares = [];

const create = fn => new Lambda(fn, middlewares);
const use = middleware => middlewares.push(middleware);

const Lambd = {
  create,
  use,
};

module.exports = Lambd;
module.exports.Lambda = Lambda;
