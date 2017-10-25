const { lambdaHOF, methodHOF } = require('./hof');

class Lambda {
  constructor(fn, { middlewares = [] }) {
    this.fn = fn;
    this.middlewares = [
      lambdaHOF
    ];
    this.use(middlewares);
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
