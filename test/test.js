const chainProxy = require('../dist')
const assert = require('assert')

class ForTest {
  constructor () {
    this._value = ''
  }
  value () {
    return this._value
  }
  async echo (text) {
    return text
  }
  async f1 () {
    this._value += '1'
  }
  async f2 () {
    this._value += '2'
  }
  async f3 () {
    this._value += '3'
  }
  async throwError () {
    throw new Error('error')
  }
}

describe('chainProxy', _ => {
  it('add chain interface', (done) => {
    const obj  = chainProxy(new ForTest())
    let result = null
    obj.f1().f2().f3().value().end().then((value) => {
      assert.equal('123', value)
      done()
    })
  })
  it('add chain interface.(reverse)', (done) => {
    const obj  = chainProxy(new ForTest())
    let result = null
    obj.f3().f2().f1().value().end().then((value) => {
      assert.equal('321', value)
      done()
    })
  })
  describe('#result', _ => {
    it('receive last return value', (done) => {
      const obj  = chainProxy(new ForTest())
      let result = null
      obj.echo('AAA').result(v => result = v).end().then(() => {
        assert.equal('AAA', result)
        done()
      })
    })
  })
  it('result function', (done) => {
    const obj  = chainProxy(new ForTest())
    let result = null
    obj.echo('AAA').result(v => result = v).end().then(() => {
      assert.equal('AAA', result)
      done()
    })
  })
  it('returns target', () => {
    const target = new ForTest()
    target.v = 100
    const obj  = chainProxy(target)
    assert.equal(100, obj.target.v)
  })
  it('call onChainFinished after end()', (done) => {
    let v = 100;
    const obj  = chainProxy(new ForTest(), {onChainFinished: () => { v = 200; }})
    let result = null
    obj.echo('AAA').result(v => result = v).end().then(() => {
      assert.equal('AAA', result)
      assert.equal(200, v)
      done()
    })
  })
  it('removes all actions if occured an exception.', (done) => {
    let v = 0
    const obj  = chainProxy(new ForTest())
    obj.f1().throwError().f2().end().then(_ => {
      done(new Error('error'))
    }).catch(e => {
      obj.end().then(() => {
        assert.equal('1', obj.target.value())
        done()
      }).catch(e => {
        done(e)
      })
    })
  })
})


