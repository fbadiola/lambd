class Response {
  static setDefaultHeaders(key, value) {
    Response._defaultHeaders = Response._defaultHeaders || {};
    if (typeof key === 'string' && typeof value === 'string') {
      Response._defaultHeaders[key] = value;
    } else if (typeof key === 'object' && key instanceof Object) {
      Object.keys(key).forEach((k) => {
        const val = key[k];
        Response.setDefaultHeaders(k, val);
      });
    }
  }
  constructor (ctx) {
    this.ctx = ctx;
    this.data = {
      statusCode: 200,
      headers: Object.assign({
        'Content-Type': 'application/json'
      }, Response._defaultHeaders),
      body: ''
    };
  }

  get(key) {
    return this.data.headers[key];
  }

  set(key, value) {
    if (typeof key === 'string' && typeof value === 'string') {
      this.data.headers[key] = value;
    } else if (typeof key === 'object' && key instanceof Object) {
      Object.keys(key).forEach((k) => {
        const val = key[k];
        this.set(k, val);
      });
    }
    return this;
  }

  status(code) {
    if (Number.isInteger(code)) {
      this.data.statusCode = code;
    }
    return this;
  }

  json(obj) {
    const body = JSON.stringify(obj);
    this.send(body);
  }

  send(body) {
    this.data.body = body;
    this.ctx.succeed(this.data);
  }

  error(error, status) {
    const message = error instanceof Error ? error.message || error.reason : error;
    const statusCode = status || this.data.statusCode === 200 ? 500 : this.data.statusCode;
    this.status(statusCode);
    this.json({ message });
  }
}

module.exports = Response;
