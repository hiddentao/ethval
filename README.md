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

console.log( new EthVal(balance).toEth().toFixed(2) ) // e.g. "0.02"
```

Use it calculate the Wei/Gwei/Eth equivalent of a given value:

```js
const v = new EthVal('1.234', 'eth')

console.log( b.toGwei().toString() ) // "1234000000000000"
```

You can also output hex and binary strings:

```js
const v = new EthVal(255)

console.log( b.toString(16) ) // "0xff"
console.log( b.toString(2) ) // "11111111"
```

## API

**`new EthValue(input, unit = 'wei')`**

Constructs a new `EthValue` instance.

* `input` - can be a `Number`, a `string` (in base-10 or base-16/hex format),
another `EthValue` instance, or a `BN` instance.
* `unit` - must be one of `eth`, `gwei` or `wei` (default).

**`.toWei()`**

Convert the value to its Wei equivalent and return a new `EthValue` instance.

**`.toGwei()`**

Convert the value to its Gwei equivalent and return a new `EthValue` instance.

**`.toEth()`**

Convert the value to its Eth equivalent and return a new `EthValue` instance.

**`.add(input)`**

Add `input` to this value and return a new `EthValue` instance.

* `input` - _same as for the `EthValue` constructor_

**`.sub(input)`**

Subtract `input` from this value and return a new `EthValue` instance.

* `input` - _same as for the `EthValue` constructor_

**`.mul(input)`**

Multiply `input` with this value and return a new `EthValue` instance.

* `input` - _same as for the `EthValue` constructor_

**`.div(input)`**

Divide this value by `input` and return a new `EthValue` instance.

* `input` - _same as for the `EthValue` constructor_

**`.toString(base)`**

Return string representation of this value according to the given number base.
For example, if `base` is 2 then a binary string representation is returned, if
`16` then a hexadecimal string representation is returned.

* `base` - either 2, 16 or 10.

**`.toFixed(precision)`**

Return base-10 decimal-point representation of this value to the given precision.

* `precision` - maximum no. of numbers after the decimal point.

**`.toWeiBN()`**

Return a `BN` instance representing this value when converted to its `wei` equivalent.

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
