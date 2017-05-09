
const RESULT_FUNCTION_NAME = '___RESULT_FUNCTION'

class ChainObject {
  constructor (target, options) {
    const defaults = {
      debug: false
    }
    this.target = target
    this.options = Object.assign(defaults, options)
    this.actions = []
  }

  addAction (name, args) {
    this.actions.push({name, args})
  }

  async end () {
    let result = null
    try {
      for (let idx in this.actions) {
        const action = this.actions[idx]
        if (this.options.debug) {
          console.log(`[async-chain-proxy] execute '${action.name}'`)
        }
        if (RESULT_FUNCTION_NAME === action.name) {
          result = await action.args[0].apply(null, [result])
        } else {
          result = await this.target[action.name].apply(this.target, action.args)
        }
      }
    } catch (e) {
      if (this.options.debug) {
        console.log(e)
      }
      throw e
    }
    this.actions = []
    return result
  }
}

function makeHandler (target, options) {
  return {
    get: function (chainObj, name) {
      if (name === options.endFuncName) {
        return function () {
          return chainObj.end(chainObj, arguments).catch((e) => {
            if (options.debug) {
              console.log(e)
            }
            throw e
          })
        }
      } else if (name === options.resultFuncName) {
        return function () {
          chainObj.addAction(RESULT_FUNCTION_NAME, arguments)
          return this
        }
      } else if (typeof(target[name]) === 'function') {
        return function () {
          chainObj.addAction(name, arguments)
          return this
        }
      } else if (name in target) {
        return target[name]
      } else {
        throw new Error(`'${name}' is not defined on a target object.`)
      }
    },
    set: function (chainObj, name, value) {
      throw new Error('You cannot set a value to Proxy object.')
    }
  }
}

function createChainObject (target, options = {}) {
  const defaultParams = {debug: false, resultFuncName: 'result', endFuncName: 'end'}
  options = Object.assign(defaultParams, options)
  let chainObject = new ChainObject(target, options)
  return new Proxy(
    chainObject,
    makeHandler (target, options)
  )
}

module.exports = createChainObject

