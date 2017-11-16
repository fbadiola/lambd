const isPromise = (obj) => !!(obj && obj.then && obj.then.call && obj.catch && obj.catch.call);
const isFunction = (obj) => !!obj.call;

const methodHOF = (method, promiseFn) => (fn) => (options) => {
  const { request, response } = options;
  if (request.method.toLowerCase() === method.toLowerCase()) {
    if (isFunction(promiseFn)) {
      const promise = promiseFn(options);
      if (isPromise(promise)) {
        promise
          .then(result => response.json(result))
          .catch(error => {
            let message = error;
            let code = 500;
            if (error) {
              code = error.code || code;
              message = error.message || message;
            }
            return response.status(code).error(message);
          });
      }
    }
  } else {
    fn(options);
  }
};

module.exports = methodHOF;
