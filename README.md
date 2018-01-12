# LAMBD
Create and maintain your AWS Lambdas or Google Cloud Functions functions easily with **LAMBD**!

## How to install
```npm i -S lambd```

## Getting started

### How does I select platform?

```javascript
const Lambd = require('lambd');
const { Platforms } = Lambd;

const myLambdaFunction = ({ response }) => {
  // Here your lambda code
  response.json({ ok: true });
});

// AWS Lambdas by default:
// Lambd.create()

// Google Cloud Functions
// Lambd.createFunctions()

// Otherwise
// You can use Platform enum object and select platform
module.exports.myFunction = Lambd.platform(Platforms.GCLOUD).get(myLambdaFunction).getHandler();

// This allows you make compatible all your lambdas between AWS and GCLOUD Functions platforms only you must change platform on code.

```

### Simply example
```javascript
const Lambd = require('lambd');

const myLambdaFunction = ({ response }) => {
  // Here your functions code
  response.json({ ok: true });
});

module.exports.handler = Lambd.createFunctions().get(myLambdaFunction).getHandler();

```

### API example
```javascript
const Lambd = require('lambd');

const myLambda = Lambd.create();

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
const myLambda = Lambd.create();
myLambda.use(mongoMiddleware);

// Set headers to all lambdas
// Lambd.set('MyFirstHeader', 'value');
// Lambd.set({ 'MySecondHeader': 'value2', 'MyThirdHeader': 'value3' });

// Lambda header
myLambda.set('MyFirstHeader', 'value');
myLambda.set({ 'MySecondHeader': 'value2', 'MyThirdHeader': 'value3' });

module.exports.handler = myLambda.get(myLambdaFunction).getHandler();
```
