# casbin-mongoose-adapter

Mongoose adapter for Casbin https://github.com/casbin/node-casbin

Mongoose Adapter is the [Mongoose](https://github.com/Automattic/mongoose/) adapter for [Casbin](https://github.com/casbin/node-casbin). With this library, Casbin can load policy from Mongoose supported database or save policy to it.

Based on [Officially Supported Databases](https://mongoosejs.com/docs/), The current supported databases are MongoDB.

## Installation

    npm install casbin-mongoose-adapter

## Simple Example

```js
const { newEnforcer } = require('casbin')
const Adapter = require('casbin-mongoose-adapter')

~(async function() {
  // Initialize a mongoose adapter and use it in a Node-Casbin enforcer:
  // The adapter will use the MongoDB database named "test".
  // If it doesn't exist, the adapter will create it automatically.
  try {
    const a = await new Adapter('mongodb://localhost/test', {
      useNewUrlParser: true
    })
    await a.init()

    const e = await newEnforcer('examples/rbac_model.conf', a)

    // Load the policy from DB.
    await e.loadPolicy()

    // Add the policy.
    await e.addPolicy(null, 'p', ['alice', 'data1', 'read'])

    // Check the permission.
    isMatched = e.enforce('alice', 'data1', 'read')
    console.log(isMatched)

    await e.removePolicy(null, 'p', ['alice', 'data1', 'read'])

    // Save the policy back to DB.
    await e.savePolicy()

    process.exit()
  } catch (error) {
    console.error(error)
  }
})()
```

## Getting Help

- [Casbin](https://github.com/casbin/node-casbin)

## License

This project is under Apache 2.0 License. See the [LICENSE](LICENSE) file for the full license text.
