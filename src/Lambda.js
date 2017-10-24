const { lambdaHOF } = require('./hof');

class Lambda {
  constructor(fn) {
    this.fn = fn;
  }

  getHandler() {
    return lambdaHOF(this.fn);
  }
}

module.exports = Lambda;
