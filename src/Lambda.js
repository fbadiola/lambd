const { lambdaHOF } = require('./hof');

class Lambda {
  constructor(fn) {
    this.fn = fn;
    this.middlewares = [
      lambdaHOF
    ];
    this.queue = null;
  }

  use(fn) {
    if (fn && fn.length && fn.forEach) {
      fn.forEach(f => this.use(f));
    } else if (fn && typeof fn === 'function') {
      this.middlewares.push(fn);
    }
    return this;
  }

  getHandler() {
    return this.middlewares.reverse().reduce((memo, cb) => cb(memo), this.fn);
  }
}

module.exports = Lambda;
