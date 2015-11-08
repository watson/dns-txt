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
  t.end()
})

test('encode - empty', function (t) {
  var buf = txt.encode({})
  var expected = new Buffer('00', 'hex')
  t.deepEqual(buf, expected)
  t.end()
})

test('encode - undefined', function (t) {
  var buf = txt.encode()
  var expected = new Buffer('00', 'hex')
  t.deepEqual(buf, expected)
  t.end()
})

test('decode', function (t) {
  var result = txt.decode(txt.encode(obj))
  var expected = {
    string: new Buffer('foo'),
    number: new Buffer('42'),
    null: new Buffer('null'),
    bool: true,
    buffer: new Buffer('bar')
  }
  t.deepEqual(result, expected)
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
  var result = txt.decode(txt.encode(orig))
  t.deepEqual(result, expected)
  t.end()
})

test('decode - single zero bype', function (t) {
  var result = txt.decode(new Buffer('00', 'hex'))
  t.deepEqual(result, {})
  t.end()
})
