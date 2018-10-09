import { Decimal } from 'decimal.js'
import { isBN, toBN } from 'web3-utils'

const toDecimal = v => (isBN(v) ? new Decimal(v.toString(10)) : new Decimal(v))

export default class EthValue {
  constructor(src, unit = 'wei') {
    if (src instanceof EthValue) {
      this._n = toDecimal(src._n)
      this._unit = src._unit
    } else {
      this._n = toDecimal(src)
      this._unit = unit
    }
    ;['mul', 'sub', 'div', 'add'].forEach(method => {
      this[method] = v => (
        new EthValue(this._n[method].call(this._n, toDecimal(v)), this._unit)
      )
    })
  }

  get isWei() {
    return 'wei' === this._unit
  }

  get isGwei() {
    return 'gwei' === this._unit
  }

  get isEth() {
    return 'eth' === this._unit
  }

  get unit() {
    return this._unit
  }

  scaleDown(v) {
    return this.mul(toDecimal(10).pow(toDecimal(v)))
  }

  scaleUp(v) {
    return this.div(toDecimal(10).pow(toDecimal(v)))
  }

  toWei() {
    if (this.isWei) {
      return new EthValue(this)
    }
    if (this.isGwei) {
      const v = this.scaleDown(3)
      v._unit = 'wei'
      return v
    }
    if (this.isEth)  {
      const v = this.scaleDown(18)
      v._unit = 'wei'
      return v
    }

    throw new Error('Unit of measurement uncertain')
  }

  toGwei() {
    if (this.isWei) {
      const v = this.scaleUp(3)
      v._unit = 'gwei'
      return v
    }
    if (this.isGwei) {
      return new EthValue(this)
    }
    if (this.isEth) {
      const v = this.scaleDown(15)
      v._unit = 'gwei'
      return v
    }

    throw new Error('Unit of measurement uncertain')
  }

  toEth() {
    if (this.isWei) {
      const v = this.scaleUp(18)
      v._unit = 'eth'
      return v
    }
    if (this.isGwei) {
      const v = this.scaleUp(15)
      v._unit = 'eth'
      return v
    }
    if (this.isEth) {
      return new EthValue(this)
    }

    throw new Error('Unit of measurement uncertain')
  }

  toString(v) {
    switch (v) {
      case 2:
        let str = this._n.toBinary()
        str = str.substr(str.indexOf('b') + 1)
        return str
      case 16:
        return this._n.toHexadecimal()
      default:
        return this._n.toString()
    }
  }

  toFixed(v) {
    return this._n.toFixed(v)
  }

  toWeiBN() {
    return toBN(new EthValue(this.toString(), this._unit).toWei().toString())
  }
}
