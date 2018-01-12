const Lambda = require('./Lambda');
const ResponseDefaultHeaders = require('./ResponseDefaultHeaders');
const Platforms = require('./Platforms');

const middlewares = [];

const _notFoundFn = ({ request, response }) => response.status(404).send('not found');

const create = (fn, opt) => {
  if (fn && typeof fn !== 'function') {
    opt = fn || {};
    fn = _notFoundFn;
  } else {
    console.warn('[DEPRECATED] Lambda.create will not accepts function in first argument soon.');
  }

  const options = Object.assign({ middlewares }, opt);
  return new Lambda(fn, options);
}

const createFunctions = (opt) => {
  const options = Object.assign({ middlewares }, opt || {}, { platform: Platforms.GCLOUD });
  return new Lambda(_notFoundFn, options);
}

const use = middleware => {
  middlewares.push(middleware);
  return Lambd;
};

const set = (key, value) => {
  ResponseDefaultHeaders.set(key, value);
};

const platform = (platform, opts) => {
  if (Platforms.isValidPlatform(platform)) {
    opts = opts || {};
    opts.platform = platform;
    return create(opts);
  } else {
    throw new Error('Platform is not valid');
  }
}

const Lambd = {
  create,
  createFunctions,
  platform,
  use,
  set,
  Platforms,
};

module.exports = Lambd;