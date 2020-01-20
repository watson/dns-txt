# dns-txt (esp8266)

Based on the test-results of this lib, I would dare say **this is an
ugly hack, do not use unless desparate!!**

This has been altered from the original specifically for my own use on
hacking around with an ESP8266 based IoT platform. Either the chip does
something weird, or more modern impementation of node has changed how
`Buffer.slice()` works, either way, I was losing all first-chars of my
keys, this custom fork fixes that...

Encode or decode the RDATA field in multicast DNS TXT records. For use
with DNS-Based Service Discovery. For details see [RFC
6763](https://tools.ietf.org/html/rfc6763).

## Installation

```
npm install dns-txt
```

## Usage

```js
var txt = require('dns-txt')()

var obj = {
  foo: 1,
  bar: 2
}

var enc = txt.encode(obj) // <Buffer 05 66 6f 6f 3d 31 05 62 61 72 3d 32>

txt.decode(enc) // { foo: '1', bar: '2' }
```

## API

The encoder and decoder conforms to [RFC 6763](https://tools.ietf.org/html/rfc6763).

### Initialize

The module exposes a constructor function which can be called with an
optional options object:

```js
var txt = require('dns-txt')({ binary: true })
```

The options are:

- `binary` - If set to `true` all values will be returned as `Buffer`
  objects. The default behavior is to turn all values into strings. But
  according to the RFC the values can be any binary data. If you expect
  binary data, use this option.

#### `txt.encode(obj, [buffer], [offset])`

Takes a key/value object and returns a buffer with the encoded TXT
record. If a buffer is passed as the second argument the object should
be encoded into that buffer. Otherwise a new buffer should be allocated
If an offset is passed as the third argument the object should be
encoded at that byte offset. The byte offset defaults to `0`.

This module does not actively validate the key/value pairs, but keep the
following in rules in mind:

- To be RFC compliant, each key should conform with the rules as
  specified in [section
  6.4](https://tools.ietf.org/html/rfc6763#section-6.4).

- To be RFC compliant, each value should conform with the rules as
  specified in [section
  6.5](https://tools.ietf.org/html/rfc6763#section-6.5).

After encoding `txt.encode.bytes` is set to the amount of bytes used to
encode the object.

#### `txt.decode(buffer, [offset], [length])`

Takes a buffer and returns a decoded key/value object. If an offset is
passed as the second argument the object should be decoded from that
byte offset. The byte offset defaults to `0`. Note that all keys will be
lowercased and all values will be Buffer objects.

After decoding `txt.decode.bytes` is set to the amount of bytes used to
decode the object.

#### `txt.encodingLength(obj)`

Takes a single key/value object and returns the number of bytes that the given
object would require if encoded.

## License

MIT
