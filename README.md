# LAMBD
Create and maintain your AWS Lambdas functions easily with **LAMBD**!

## How to install
```npm i -S lambd```

## Getting started

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

### API example
```javascript
const Lambd = require('lambd');

const myLambda = Lambd.create(({ response }) => response.status(404).error('not found'));

// Middlewares
const authMiddleware = (next) => (options) => {
  const { request, response } = options;
  const { auth } = request;
  if (auth && auth === 'esto_es_una_prueba') {
    next(options);
  } else {
    response.status(403).error('not authorized');
  }
};

const mongoMiddleware = (next) => (options) => {
  const { response } = options;
  const url = 'mongodb://localhost:27017/myproject';
  MongoClient.connect(url, (err, db) => {
    if (err) {
      return response.error(err);
    }
    options.db = db;
    return next(options);
  });
};

myLambda.use(authMiddleware);
myLambda.use(mongoMiddleware);

// Route: /users/:userid
const handler = myLamba
  .get(({ request, db }) => UserService(db).findById(request.params.userid))
  .put(({ request, db }) => UserService(db).findByIdAndUpdate(request.params.userid, request.body))
  .delete(({ request, db }) => UserService(db).findByIdAndDelete(request.params.userid))
  .getHandler();

module.exports.handler = handler;

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
    return next(options);
  });
};

// Global Middleware
// Lambd.use(mongoMiddleware);

// Lambda Middleware
const myLambda = Lambd.create(myLambdaFunction);
myLambda.use(mongoMiddleware);

// Set headers to all lambdas
// Lambd.set('MyFirstHeader', 'value');
// Lambd.set({ 'MySecondHeader': 'value2', 'MyThirdHeader': 'value3' });

// Lambda header
myLambda.set('MyFirstHeader', 'value');
myLambda.set({ 'MySecondHeader': 'value2', 'MyThirdHeader': 'value3' });

module.exports.handler = myLambda.getHandler();
```
