# mdns-txt

Encode or decode multicast DNS TXT records. For use with DNS-Based
Service Discovery. For details see [RFC 6763](https://tools.ietf.org/html/rfc6763).

[![Build status](https://travis-ci.org/watson/mdns-txt.svg?branch=master)](https://travis-ci.org/watson/mdns-txt)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install mdns-txt
```

## Usage

```js
var txt = require('mdns-txt')

var obj = {
  foo: 1,
  bar: 2
}

var enc = txt.encode(obj) // <Buffer 05 66 6f 6f 3d 31 05 62 61 72 3d 32>

txt.decode(enc) // { foo: <Buffer 31>, bar: <Buffer 32> }
```

## API

The encoder and decoder conforms to [RFC 6763](https://tools.ietf.org/html/rfc6763).

### `.encode(obj)`

Takes a single key/value object and returns a buffer with the encoded
TXT record.

This module does not actively validate the key/value pairs, but keep the
following in rules in mind:

- To be RFC compliant, each key should conform with the rules as
  specified in [section
  6.4](https://tools.ietf.org/html/rfc6763#section-6.4).

- To be RFC compliant, each value should conform with the rules as
  specified in [section
  6.5](https://tools.ietf.org/html/rfc6763#section-6.5).

### `.decode(buffer)`

Takes a single buffer and returns a decoded key/value object. Note that
all keys will be lowercased and all values will be Buffer objects.

### `.encodingLength(obj)`

Takes a single key/value object and returns the number of bytes that the given
object would require if encoded.

## License

MIT
