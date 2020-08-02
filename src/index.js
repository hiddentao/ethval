import { Decimal } from 'decimal.js'

const PreciseDecimal = Decimal.clone({ defaults: true, toExpPos: 33 })

const toDecimal = a => {
  if (a) {
    if (a._hex) {
      a = a._hex
    } else if (a._isBigNumber) {
      a = a.toString(10)
    }
  }

  return new PreciseDecimal(`${a}`)
}

const input2Dec = (original, input) => (
  input._n ? input.to(original._unit)._n : toDecimal(input)
)

export default class EthVal {
  constructor (src, unit = 'wei') {
    if (src instanceof EthVal) {
      this._n = toDecimal(src._n)
      this._unit = src._unit
    } else {
      this._n = toDecimal(src)
      this._unit = unit
    }
    [ 'mul', 'sub', 'div', 'add' ].forEach(method => {
      this[method] = v => (
        new EthVal(this._n[method].call(this._n, input2Dec(this, v)), this._unit)
      )
    })
    ;[ 'gt', 'gte', 'lt', 'lte', 'eq' ].forEach(method => {
      this[method] = v => (
        this._n[method].call(this._n, input2Dec(this, v))
      )
    })
  }

  get isWei () {
    return 'wei' === this._unit
  }

  get isGwei () {
    return 'gwei' === this._unit
  }

  get isEth () {
    return 'eth' === this._unit
  }

  get unit () {
    return this._unit
  }

  scaleDown (v) {
    return this.mul(toDecimal(10).pow(toDecimal(v)))
  }

  scaleUp (v) {
    return this.div(toDecimal(10).pow(toDecimal(v)))
  }

  round () {
    return new EthVal(this._n.toDecimalPlaces(0))
  }

  toWei () {
    if (this.isWei) {
      return new EthVal(this)
    }
    if (this.isGwei) {
      const v = this.scaleDown(9)
      v._unit = 'wei'
      return v
    }
    if (this.isEth) {
      const v = this.scaleDown(18)
      v._unit = 'wei'
      return v
    }

    throw new Error('Unit of measurement uncertain')
  }

  toGwei () {
    if (this.isWei) {
      const v = this.scaleUp(9)
      v._unit = 'gwei'
      return v
    }
    if (this.isGwei) {
      return new EthVal(this)
    }
    if (this.isEth) {
      const v = this.scaleDown(9)
      v._unit = 'gwei'
      return v
    }

    throw new Error('Unit of measurement uncertain')
  }

  toEth () {
    if (this.isWei) {
      const v = this.scaleUp(18)
      v._unit = 'eth'
      return v
    }
    if (this.isGwei) {
      const v = this.scaleUp(9)
      v._unit = 'eth'
      return v
    }
    if (this.isEth) {
      return new EthVal(this)
    }

    throw new Error('Unit of measurement uncertain')
  }

  to (unit) {
    switch (unit) {
      case 'wei':
        return this.toWei()
      case 'gwei':
        return this.toGwei()
      case 'eth':
        return this.toEth()
      default:
        throw new Error(`Unrecognized unit: ${unit}`)
    }
  }

  toString (v) {
    switch (v) {
      case 2: {
        let str = this._n.toBinary()
        str = str.substr(str.indexOf('b') + 1)
        return str
      }
      case 16:
        return this._n.toHexadecimal()
      default:
        return this._n.toString()
    }
  }

  toFixed (v) {
    return this._n.toFixed(v)
  }

  toNumber () {
    return this._n.toNumber()
  }
}
