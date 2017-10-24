const Lambda = require('./Lambda');

const create = (fn) => {
  return new Lambda(fn);
};

const Lambd = {
  create,
};

module.exports = Lambd;
module.exports.Lambda = Lambda;
