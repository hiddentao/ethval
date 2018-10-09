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
    expect(e.toString()).toEqual('1000000000')
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
    expect(e.toString()).toEqual('1000000000')
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
    const e = new EthVal('1000000000', 'gwei').toWei()
    expect(e.toString()).toEqual('1000000000000000000')
    expect(e.unit).toEqual('wei')
    expect(e.isWei).toEqual(true)
    expect(e.isGwei).toEqual(false)
    expect(e.isEth).toEqual(false)
  })

  it('from gwei to gwei', () => {
    const e = new EthVal('1000000000', 'gwei').toGwei()
    expect(e.toString()).toEqual('1000000000')
    expect(e.unit).toEqual('gwei')
    expect(e.isWei).toEqual(false)
    expect(e.isGwei).toEqual(true)
    expect(e.isEth).toEqual(false)
  })

  it('from gwei to eth', () => {
    const e = new EthVal('1000000000', 'gwei').toEth()
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
    expect(g.toString()).toEqual('1000000000')
    expect(w.toString()).toEqual('1000000000000000000')
  })

  it('using to(wei)', () => {
    const src = new EthVal('1')
    const v1 = src.to('wei')
    const v2 = src.toWei()
    expect(v1.toString()).toEqual(v2.toString())
  })

  it('using to(gwei)', () => {
    const src = new EthVal('1')
    const v1 = src.to('gwei')
    const v2 = src.toGwei()
    expect(v1.toString()).toEqual(v2.toString())
  })

  it('using to(eth)', () => {
    const src = new EthVal('1000000000000000000')
    const v1 = src.to('eth')
    const v2 = src.toEth()
    expect(v1.toString()).toEqual(v2.toString())
  })

  it('back and forth', () => {
    const e = new EthVal('1000000000000000000')

    expect(
      e.toGwei()
        .toEth()
        .toWei()
        .toEth()
        .toGwei()
        .toString()
    ).toEqual('1000000000')
  })

  it('from decimal eth to wei', () => {
    const e = new EthVal('1.2345', 'eth')

    expect(e.toWei().toString()).toEqual('1234500000000000000')
  })

  it('and throw an error if unit is uncertain', () => {
    try {
      new EthVal('1', 'bad').toWei()
    } catch (err) {
      expect(err).toBeDefined()
    }

    try {
      new EthVal('1', 'bad').toGwei()
    } catch (err) {
      expect(err).toBeDefined()
    }

    try {
      new EthVal('1', 'bad').toEth()
    } catch (err) {
      expect(err).toBeDefined()
    }

    try {
      new EthVal('1').to('bad')
    } catch (err) {
      expect(err).toBeDefined()
    }
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

describe('supports calculation and', () => {
  it('does basic arithmetic', () => {
    const e = new EthVal('1.2345', 'eth').mul(10).div(5)
    const e2 = new EthVal('1.2345').mul(2)

    expect(e.toString()).toEqual('2.469')
    expect(e.toString()).toEqual(e2.toString())

    expect(
      new EthVal('1')
        .add('2.34')
        .sub('5.23')
        .mul('-1.2')
        .toString()
    ).toEqual('2.268')
  })

  it('handles instances', () => {
    const e = new EthVal(1)
    const e2 = new EthVal(13)
    const e3 = new EthVal(2)

    expect(e.add(e2).div(e3).toString()).toEqual('7')
  })

  it('knows to ensure instances have the same units', () => {
    const e = new EthVal(1, 'eth')
    const e2 = new EthVal(13000000000, 'gwei')

    expect(e.add(e2).toString()).toEqual('14')
  })
})

describe('supports boolean logic via', () => {
  it('basic comparison', () => {
    const e = new EthVal('1.2345').mul(10).div(5)
    const e2 = new EthVal('12').mul(2)
    const e3 = toBN('24')

    expect(e2.gt(e)).toEqual(true)
    expect(e.lt(e2)).toEqual(true)
    expect(e.gte(e2)).toEqual(false)

    expect(new EthVal(e3).gt(e)).toEqual(true)
    expect(e.lte(e3)).toEqual(true)
    expect(e.gte(e3)).toEqual(false)

    expect(e2.eq(e3)).toEqual(true)
    expect(e2.lte(e3)).toEqual(true)
    expect(e2.gte(e3)).toEqual(true)

    expect(new EthVal(e3).eq(e2)).toEqual(true)
    expect(new EthVal(e3).gte(e2)).toEqual(true)
    expect(new EthVal(e3).lte(e2)).toEqual(true)
  })

  it('knows to ensure instances have the same units', () => {
    const e = new EthVal(1, 'eth')
    const e2 = new EthVal('13000000000', 'gwei')
    const e3 = new EthVal('13000000000000000000', 'wei')

    expect(e.gt(e2)).toEqual(false)
    expect(e.lte(e2)).toEqual(true)

    expect(e2.gt(e)).toEqual(true)
    expect(e2.lte(e)).toEqual(false)

    expect(e2.eq(e3)).toEqual(true)
    expect(e3.eq(e2)).toEqual(true)
  })
})
