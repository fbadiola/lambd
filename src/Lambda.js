const { lambdaHOF, methodHOF, functionsHOF } = require('./hof');
const Platforms = require('./Platforms');

class Lambda {
  constructor(fn, { middlewares = [], platform }) {
    this.fn = fn;
    this.platform = platform;
    this.middlewares = [];

    this._formatMessage = data => data;

    this.use(this._getMiddlewareByPlatform(this.platform));
    this.use(middlewares);
  }

  setFormatMessage(formatMessage) {
    if (typeof formatMessage === 'function') {
      this._formatMessage = (message, errorCode, error) => {
        return formatMessage(message, errorCode, error);
      };
    } else {
      throw new TypeError('Format Message is not a function');
    }
    return this;
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

  _getMethodOptions() {
    return {
      formatMessage: this._formatMessage
    };
  }

  get(path, promiseFn) {
    this.middlewares.push(methodHOF('GET', path, promiseFn, this._getMethodOptions()));
    return this;
  }

  post(path, promiseFn) {
    this.middlewares.push(methodHOF('POST', path, promiseFn, this._getMethodOptions()));
    return this;
  }

  put(path, promiseFn) {
    this.middlewares.push(methodHOF('PUT', path, promiseFn, this._getMethodOptions()));
    return this;
  }

  patch(path, promiseFn) {
    this.middlewares.push(methodHOF('PATCH', path, promiseFn, this._getMethodOptions()));
    return this;
  }

  delete(path, promiseFn) {
    this.middlewares.push(methodHOF('DELETE', path, promiseFn, this._getMethodOptions()));
    return this;
  }

  getHandler() {
    return this.middlewares.reverse().reduce((memo, cb) => cb(memo), this.fn);
  }
}

module.exports = Lambda;