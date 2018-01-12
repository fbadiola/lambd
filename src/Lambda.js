const { lambdaHOF, methodHOF, functionsHOF } = require('./hof');
const Platforms = require('./Platforms');

class Lambda {
  constructor(fn, { middlewares = [], platform }) {
    this.fn = fn;
    this.platform = platform;
    this.middlewares = [];

    this.use(this._getMiddlewareByPlatform(this.platform));
    this.use(middlewares);
  }

  _getMiddlewareByPlatform(_platform) {
    const platform = _platform || this.platform;
    let middleware;
    switch (platform) {
      case Platforms.GCLOUD:
        middleware = functionsHOF;
        break;
      case Platforms.AWS:
      default:
        middleware = lambdaHOF;
        break;
    }
    return middleware;
  }

  use(fn) {
    if (fn && fn.length && fn.forEach) {
      fn.forEach(f => this.use(f));
    } else if (fn && typeof fn === 'function') {
      this.middlewares.push(fn);
    }
    return this;
  }

  get(promiseFn) {
    this.middlewares.push(methodHOF('GET', promiseFn));
    return this;
  }

  post(promiseFn) {
    this.middlewares.push(methodHOF('POST', promiseFn));
    return this;
  }

  put(promiseFn) {
    this.middlewares.push(methodHOF('PUT', promiseFn));
    return this;
  }

  patch(promiseFn) {
    this.middlewares.push(methodHOF('PATCH', promiseFn));
    return this;
  }

  delete(promiseFn) {
    this.middlewares.push(methodHOF('DELETE', promiseFn));
    return this;
  }

  getHandler() {
    return this.middlewares.reverse().reduce((memo, cb) => cb(memo), this.fn);
  }
}

module.exports = Lambda;