const methodHOF = (method, promiseFn) => (fn) => (options) => {
  const { request, response } = options;
  if (request.method.toLowerCase() === method.toLowerCase()) {
    promiseFn(options).then(result => response.json(result));
  } else {
    fn(options);
  }
};

module.exports = methodHOF;
