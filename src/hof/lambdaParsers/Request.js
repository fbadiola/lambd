class Request {
  constructor (event) {
    this.event = event;
    this.body = this.parseBody();
  }

  parseBody() {
    let body;
    try {
      body = JSON.parse(this.event.body || '{}');
    } catch (e) {
      body = this.event.body;
    }
    return body;
  }

  get method() {
    return this.event.httpMethod;
  }

  get query() {
    return this.event.queryStringParameters || {};
  }

  get params() {
    return this.event.pathParameters || {};
  }

  get headers() {
    return this.event.headers || {};
  }

  get auth() {
    return this.headers['Authorization'] || null;
  }

  // TO DO: Get Pathname url

  get path() {
    return this.event.path || '/';
  }
}

module.exports = Request;
