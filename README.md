async-chain-proxy provides method chain interfaces for accessing async methods.

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

### receive a return value

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

### API

#### constructor(target, options = {})

##### options

  - resultFuncName(default: 'result') : If you don't prefer result function name, you can change.
  - endFuncName(default: 'end') : If you don't prefer end function name, you can change.
  - onChainFinished(default: null) : this is a callback function that is called after end().

#### result(r)

This function is used for receiving result of previous action.

#### end()

Indicates end of chained actions. If you didn't call end(), all the actions aren't called.

#### target

Returns target object.

