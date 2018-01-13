const pathParser = require('path-to-regexp');
const route = require('path-match')();

const isPromise = (obj) => !!(obj && obj.then && obj.then.call && obj.catch && obj.catch.call);
const isFunction = (obj) => !!obj.call;

const methodHOF = (method, path, promiseFn, { formatMessage }) => {
  if (typeof path === 'function') {
    promiseFn = path;
    path = '*';
  }

  const routeRE = pathParser(path);
  const match = route(path);

  return (fn) => (options) => {
    const { request, response } = options;
    const isSamePath = routeRE.test(request.path) || path.replace(/\//g, '') === '*';
    if (request.method.toLowerCase() === method.toLowerCase() && isSamePath) {
      options.request.params = Object.assign({}, match(request.path) || {}, options.request.params || {});
      if (isFunction(promiseFn)) {
        const promise = promiseFn(options);
        if (isPromise(promise)) {
          promise
            .then(result => response.json(formatMessage(result)))
            .catch(error => {
              try {
                let message = error;
                let code = 500;
                if (error) {
                  code = error.code || code;
                  message = error.message || message;
                }
                const messageFormatted = formatMessage(message, code, error);
                return response.status(messageFormatted.code || code).json(messageFormatted);
              } catch (e) {
                return response.status(500).json({ error: true, message: e.message });
              }
            });
        }
      }
    } else {
      fn(options);
    }
  };
};

module.exports = methodHOF;
