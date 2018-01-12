class ResponseDefaultHeaders {
  static set(key, value) {
    ResponseDefaultHeaders._defaultHeaders = ResponseDefaultHeaders._defaultHeaders || {};
    if (typeof key === 'string' && typeof value === 'string') {
      ResponseDefaultHeaders._defaultHeaders[key] = value;
    } else if (typeof key === 'object' && key instanceof Object) {
      Object.keys(key).forEach((k) => {
        const val = key[k];
        ResponseDefaultHeaders.set(k, val);
      });
    }
  }
}

ResponseDefaultHeaders._defaultHeaders = {};

module.exports = ResponseDefaultHeaders;