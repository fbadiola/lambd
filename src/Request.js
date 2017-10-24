class Request {
  constructor (event) {
    this.event = event;
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

  get authorization() {
    return this.headers['Authorization'] || null;
  }

  get body() {
    let body;
    try {
      body = JSON.parse(this.event.body);
    } catch (e) {
      body = this.event.body;
    }
    return body;
  }
}

module.exports = Request;
