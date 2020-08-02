# ethval

[![Build Status](https://api.travis-ci.org/hiddentao/ethval.svg?branch=master)](https://travis-ci.org/hiddentao/ethval)
[![Coverage Status](https://coveralls.io/repos/github/hiddentao/ethval/badge.svg?branch=master)](https://coveralls.io/github/hiddentao/ethval?branch=master)

Easier calculation and formatting of Ethereum values.

* Supports floating point numbers
* Easily convert between Wei, Gwei and Eth
* Output binary, decimal and hexadecimal strings
* Output fixed-precision floating-point values (`toFixed()`)
* Parse and generate [BN.js](https://github.com/indutny/bn.js/) instances
* Uses [decimal.js](https://github.com/MikeMcl/decimal.js/) under the hood

## Install

* NPM/Yarn: `ethval`

## Example Usage

You can feed it [BN.js](https://github.com/indutny/bn.js/) instances returned from [web3](https://web3js.readthedocs.io/en/1.0/web3-eth.html#getbalance):

```js
const EthVal = require('ethval')

const balance = await web3.eth.getBalance(account) // returns BN.js instance

// assume balance is 20000000000000000 wei (=0.02eth)

console.log( new EthVal(balance).toEth().mul(2).toFixed(2) ) // "0.04"
```

Use it calculate the Wei/Gwei/Eth equivalent of a given value:

```js
const v = new EthVal('1.234', 'eth')

console.log( b.toGwei().toString() ) // "1234000000"
```

You can also output hex and binary strings:

```js
const v = new EthVal(255)

console.log( b.toString(16) ) // "0xff"
console.log( b.toString(2) ) // "11111111"
```

Basic arithmetic supported fully:

```js
const v = new EthVal(255)
const b = await web3.eth.getBalance('0x...') // assume balance is 100 wei

console.log( v.div(5).add(b).mul(2).sub(2).toString(16) ) // 0x12c (= 300 in base-10)
```

Comparisons too:

```js
const { toBN } = require('web3-utils')

const v = new EthVal(255)
const v2 = new EthVal('0.2', 'eth')

console.log( v2.lt(v) ) // false
console.log( v.gt(200) ) // true
console.log( v.lte(toBN('0xFFFF')) ) // true
```

It also ensures units are aligned when performing operations:

```js
const v = new EthVal(25500)
const v2 = new EthVal('0.2', 'eth')

console.log( v2.gt(v) ) // true
console.log( v.add(v2).toString() ) // "200000000000025500"
console.log( v2.add(v).toString() ) // "0.2000000000000255"
```

## API

**`new EthVal(input, unit = 'wei')`**

Constructs a new `EthVal` instance.

* `input` - can be a `Number`, a `string` (in base-10 or base-16/hex format),
another `EthVal` instance, or a `BN` instance.
* `unit` - must be one of `eth`, `gwei` or `wei` (default).

**`.toWei()`**

Convert the value to its Wei equivalent and return a new `EthVal` instance.

**`.toGwei()`**

Convert the value to its Gwei equivalent and return a new `EthVal` instance.

**`.toEth()`**

Convert the value to its Eth equivalent and return a new `EthVal` instance.

**`.add(input)`**

Add `input` to this value and return a new `EthVal` instance.

* `input` - _same as for the `EthVal` constructor_

**`.sub(input)`**

Subtract `input` from this value and return a new `EthVal` instance.

* `input` - _same as for the `EthVal` constructor_

**`.mul(input)`**

Multiply `input` with this value and return a new `EthVal` instance.

* `input` - _same as for the `EthVal` constructor_

**`.div(input)`**

Divide this value by `input` and return a new `EthVal` instance.

* `input` - _same as for the `EthVal` constructor_

**`.round()`**

Round this value to the nearest integer (i.e 0 decimal places) and return a new `EthVal` instance.

**`.eq(input)`**

Get whether this value equals `input`. Returns `true` or `false`.

* `input` - _same as for the `EthVal` constructor_

**`.lt(input)`**

Get whether this value is less than `input`. Returns `true` or `false`.

* `input` - _same as for the `EthVal` constructor_

**`.lte(input)`**

Get whether this value is less than or equal to `input`. Returns `true` or `false`.

* `input` - _same as for the `EthVal` constructor_

**`.gt(input)`**

Get whether this value is greater than `input`. Returns `true` or `false`.

* `input` - _same as for the `EthVal` constructor_

**`.gte(input)`**

Get whether this value is greater than or equal to `input`. Returns `true` or `false`.

* `input` - _same as for the `EthVal` constructor_

**`.toString(base)`**

Return string representation of this value according to the given number base.
For example, if `base` is 2 then a binary string representation is returned, if
`16` then a hexadecimal string representation is returned.

* `base` - either 2, 16 or 10.

**`.toNumber()`**

Return base-10 `Number` representation of this value.

**`.toFixed(precision)`**

Return base-10 decimal-point representation of this value to the given precision.

* `precision` - maximum no. of numbers after the decimal point.

**`.isWei`**

Whether the current unit is `wei`.

**`.isGwei`**

Whether the current unit is `gwei`.

**`.isEth`**

Whether the current unit is `eth`.

## Dev guide

* Install deps: `npm i`
* Tests: `npm test`
* Tests with coverage: `npm run test:coverage`
* Build final lib: `npm run build`
* Lint: `npm run lint`

## License

MIT
