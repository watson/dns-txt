'use strict'

var test = require('tape')
var txt = require('./')

var obj = {
  String: 'foo',
  number: 42,
  null: null,
  bool: true,
  buffer: new Buffer('bar')
}

test('encodingLength', function (t) {
  var len = txt.encodingLength(obj)
  t.equal(len, 47)
  t.end()
})

test('encode', function (t) {
  var buf = txt.encode(obj)
  var expected = new Buffer('0a' + '537472696e67' + '3d' + '666f6f' +
                            '09' + '6e756d626572' + '3d' + '3432' +
                            '09' + '6e756c6c' + '3d' + '6e756c6c' +
                            '04' + '626f6f6c' +
                            '0a' + '627566666572' + '3d' + '626172', 'hex')
  t.deepEqual(buf, expected)
  t.equal(txt.encode.bytes, expected.length)
  t.end()
})

test('encode - empty', function (t) {
  var buf = txt.encode({})
  var expected = new Buffer('00', 'hex')
  t.deepEqual(buf, expected)
  t.equal(txt.encode.bytes, expected.length)
  t.end()
})

test('encode - undefined', function (t) {
  var buf = txt.encode()
  var expected = new Buffer('00', 'hex')
  t.deepEqual(buf, expected)
  t.equal(txt.encode.bytes, expected.length)
  t.end()
})

test('encode - with buffer', function (t) {
  var buf = new Buffer(3)
  buf.fill(255)
  txt.encode({}, buf)
  var expected = new Buffer('00ffff', 'hex')
  t.deepEqual(buf, expected)
  t.equal(txt.encode.bytes, 1)
  t.end()
})

test('encode - with buffer and offset', function (t) {
  var buf = new Buffer(3)
  buf.fill(255)
  txt.encode({}, buf, 1)
  var expected = new Buffer('ff00ff', 'hex')
  t.deepEqual(buf, expected)
  t.equal(txt.encode.bytes, 1)
  t.end()
})

test('decode', function (t) {
  var encoded = txt.encode(obj)
  var result = txt.decode(encoded)
  var expected = {
    string: new Buffer('foo'),
    number: new Buffer('42'),
    null: new Buffer('null'),
    bool: true,
    buffer: new Buffer('bar')
  }
  t.deepEqual(result, expected)
  t.equal(txt.decode.bytes, encoded.length)
  t.end()
})

test('decode - duplicate', function (t) {
  var orig = {
    Foo: 'bar',
    foo: 'ignore this'
  }
  var expected = {
    foo: new Buffer('bar')
  }
  var encoded = txt.encode(orig)
  var result = txt.decode(encoded)
  t.deepEqual(result, expected)
  t.equal(txt.decode.bytes, encoded.length)
  t.end()
})

test('decode - single zero bype', function (t) {
  var encoded = new Buffer('00', 'hex')
  var result = txt.decode(encoded)
  t.deepEqual(result, {})
  t.equal(txt.decode.bytes, encoded.length)
  t.end()
})

test('decode - with offset', function (t) {
  var encoded = new Buffer('012300', 'hex')
  var result = txt.decode(encoded, 2)
  t.deepEqual(result, {})
  t.equal(txt.decode.bytes, 1)
  t.end()
})
