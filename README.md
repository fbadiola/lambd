# LAMBD
Create and maintain your AWS Lambdas functions easily with **LAMBD**!

## How to install
```npm i -S lambd```

## How it works?

### Simply example
```javascript

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
const mongo = require('mongodb');

const myLambdaFunction = ({ response, db }) => {
  // Here your lambda code
  const promise = db.getCollection('users').find({}).limit(10).sort({ cAt: -1 });
  promise.then(users => response.json({
    ok: true,
    users
  }).catch(response.error);
});

```

