# LAMBD
Create and maintain your AWS Lambdas functions easily with **LAMBD**!

## How to install
```npm i -S lambd```

## How it works?

### Simply example
```javascript
const Lambd = require('lambd');

const myLambdaFunction = ({ response }) => {
  // Here your lambda code
  response.json({ ok: true });
});

const myLambda = Lambd.create(myLambdaFunction);
module.exports.handler = myLambda.getHandler();

```

### Advanced example
LAMBD allows you use middlewares to add power to your lambda function.

```javascript
const Lambd = require('lambd');
const { MongoClient } = require('mongodb');

const myLambdaFunction = ({ response, db }) => {
  // Here your lambda code
  db.collection('users').find({}).toArray((err, users) => {
    if (err) {
      return response.error(err);
    }
    return response.json({ ok: true, users });
  });
});

const mongoMiddleware = (next) => (options) => {
  const { response } = options;
  const url = 'mongodb://localhost:27017/myproject';
  MongoClient.connect(url, (err, db) => {
    if (err) {
      return response.error(err);
    }
    options.db = db;
    return next();
  });
};

// Global Middleware
// Lambd.use(mongoMiddleware);

// Lambda Middleware
const myLambda = Lambd.create(myLambdaFunction);
myLambda.use(mongoMiddleware);

module.exports.handler = myLambda.getHandler();
```

