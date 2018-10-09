import { isBN, toBN } from 'web3-utils'

import EthVal from './'

describe('can be constructed', () => {
  it('from a number', () => {
    const val = new EthVal(1025)
    expect(val.toString()).toEqual('1025')
  })

  it('from a decimal string', () => {
    const val = new EthVal('1025')
    expect(val.toString()).toEqual('1025')
  })

  it('from a hex string', () => {
    const val = new EthVal('0xFF')
    expect(val.toString()).toEqual('255')
  })

  it('from a BN.js instance', () => {
    const bn = toBN('0xFF')
    const val = new EthVal(bn)
    expect(val.toString()).toEqual('255')
  })

  it('from an existing instance', () => {
    const val = new EthVal('1025')
    const val2 = new EthVal(val)

    expect(val.toString()).toEqual('1025')
    expect(val2.toString()).toEqual('1025')
  })

  it('and is wei by default', () => {
    const val = new EthVal(1025)
    expect(val.isWei).toEqual(true)
  })
})

describe('can convert', () => {
  it('from wei to eth', () => {
    const e = new EthVal('1000000000000000000').toEth()
    expect(e.toString()).toEqual('1')
    expect(e.unit).toEqual('eth')
    expect(e.isWei).toEqual(false)
    expect(e.isGwei).toEqual(false)
    expect(e.isEth).toEqual(true)
  })

  it('from wei to gwei', () => {
    const e = new EthVal('1000000000000000000').toGwei()
    expect(e.toString()).toEqual('1000000000000000')
    expect(e.unit).toEqual('gwei')
    expect(e.isWei).toEqual(false)
    expect(e.isGwei).toEqual(true)
    expect(e.isEth).toEqual(false)
  })

  it('from wei to wei', () => {
    const e = new EthVal('1000000000000000000').toWei()
    expect(e.toString()).toEqual('1000000000000000000')
    expect(e.unit).toEqual('wei')
    expect(e.isWei).toEqual(true)
    expect(e.isGwei).toEqual(false)
    expect(e.isEth).toEqual(false)
  })

  it('from eth to wei', () => {
    const e = new EthVal('1', 'eth').toWei()
    expect(e.toString()).toEqual('1000000000000000000')
    expect(e.unit).toEqual('wei')
    expect(e.isWei).toEqual(true)
    expect(e.isGwei).toEqual(false)
    expect(e.isEth).toEqual(false)
  })

  it('from eth to gwei', () => {
    const e = new EthVal('1', 'eth').toGwei()
    expect(e.toString()).toEqual('1000000000000000')
    expect(e.unit).toEqual('gwei')
    expect(e.isWei).toEqual(false)
    expect(e.isGwei).toEqual(true)
    expect(e.isEth).toEqual(false)
  })

  it('from eth to eth', () => {
    const e = new EthVal('1', 'eth').toEth()
    expect(e.toString()).toEqual('1')
    expect(e.unit).toEqual('eth')
    expect(e.isWei).toEqual(false)
    expect(e.isGwei).toEqual(false)
    expect(e.isEth).toEqual(true)
  })

  it('from gwei to wei', () => {
    const e = new EthVal('1000000000000000', 'gwei').toWei()
    expect(e.toString()).toEqual('1000000000000000000')
    expect(e.unit).toEqual('wei')
    expect(e.isWei).toEqual(true)
    expect(e.isGwei).toEqual(false)
    expect(e.isEth).toEqual(false)
  })

  it('from gwei to gwei', () => {
    const e = new EthVal('1000000000000000', 'gwei').toGwei()
    expect(e.toString()).toEqual('1000000000000000')
    expect(e.unit).toEqual('gwei')
    expect(e.isWei).toEqual(false)
    expect(e.isGwei).toEqual(true)
    expect(e.isEth).toEqual(false)
  })

  it('from gwei to eth', () => {
    const e = new EthVal('1000000000000000', 'gwei').toEth()
    expect(e.toString()).toEqual('1')
    expect(e.unit).toEqual('eth')
    expect(e.isWei).toEqual(false)
    expect(e.isGwei).toEqual(false)
    expect(e.isEth).toEqual(true)
  })

  it('and will return a new instance', () => {
    const src = new EthVal('1000000000000000000')
    const w = src.toWei()
    const g = src.toGwei()
    const e = src.toEth()

    expect(w).not.toEqual(src)
    expect(g).not.toEqual(src)
    expect(e).not.toEqual(src)

    expect(src.toString()).toEqual('1000000000000000000')
    expect(e.toString()).toEqual('1')
    expect(g.toString()).toEqual('1000000000000000')
    expect(w.toString()).toEqual('1000000000000000000')
  })

  it('back and forth', () => {
    const e = new EthVal('1000000000000000000')

    expect(e.toGwei().toEth().toWei().toEth().toGwei().toString()).toEqual('1000000000000000')
  })

  it('from decimal eth to wei', () => {
    const e = new EthVal('1.2345', 'eth')

    expect(e.toWei().toString()).toEqual('1234500000000000000')
  })
})

describe('can output', () => {
  it('decimal strings', () => {
    const e = new EthVal('1.2345', 'eth')

    expect(e.toString()).toEqual('1.2345')
  })

  it('hex strings', () => {
    const e = new EthVal('123456')

    expect(e.toString(16)).toEqual('0x1e240')
  })

  it('binary strings', () => {
    const e = new EthVal('123456')

    expect(e.toString(2)).toEqual('11110001001000000')
  })

  it('decimal number rounded to a given precision', () => {
    const e = new EthVal('1789100000000000000').toEth()

    expect(e.toFixed(2)).toEqual('1.79')
  })

  it('BN.js instance representing Wei value', () => {
    const e = new EthVal('1.2345', 'eth')

    const out = e.toWeiBN()

    expect(isBN(out)).toEqual(true)

    expect(out.toString(10)).toEqual('1234500000000000000')
  })
})

// describe('supports calculation via', () => {
//   it('basic arithmetic', () => {
//     const e = new EthVal('1.2345', 'eth')
//
//     expect(e.mul(10).div(5).toString()).toEqual()
//   })
// })
