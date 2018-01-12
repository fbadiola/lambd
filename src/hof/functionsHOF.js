const ResponseDefaultHeaders = require('../ResponseDefaultHeaders');

const functionsHOF = (fn) => (request, response) => {
  // Set Default Headers
  response.set(ResponseDefaultHeaders._defaultHeaders);

  return fn({
    request,
    response
  });
};

module.exports = functionsHOF;
