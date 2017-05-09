async-chain-proxy provide method chain interfaces for accessing methods.

## How to use

### method chain

```js
class A {
  async foo () {
    console.log('foo')
  }
  async bar () {
    console.log('bar')
  }
}

const chainProxy = require('async-chain-proxy')
const obj = chainProxy(new A())
obj.foo().bar().end()

// output
>foo
>bar
```

### receive return value

```js
class A {
  async foo () {
    return 'foo'
  }
}
const chainProxy = require('async-chain-proxy')
const obj = chainProxy(new A())
obj.foo().result((v) => console.log(v)).end()

// output
>foo
```

