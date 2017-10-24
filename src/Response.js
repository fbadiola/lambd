class Response {
  constructor (ctx) {
    this.ctx = ctx;
    this.data = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
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

  error(error, status = 400) {
    const message = error instanceof Error ? error.message || error.reason : error;
    this.status(status);
    this.json({ message });
  }
}

module.exports = Response;
