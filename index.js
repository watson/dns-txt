'use strict'

var bindexOf = require('buffer-indexof')

var equalSign = new Buffer('=')

exports.encode = function (data) {
  var buf = new Buffer(exports.encodingLength(data))
  var offset = 0

  if (!data) data = {}
  var keys = Object.keys(data)

  if (keys.length === 0) {
    buf[offset] = 0
    offset++
  }

  keys.forEach(function (key) {
    var val = data[key]
    var oldOffset = offset
    offset++

    if (val === true) {
      offset += buf.write(key, offset)
    } else if (Buffer.isBuffer(val)) {
      offset += buf.write(key + '=', offset)
      var len = val.length
      val.copy(buf, offset, 0, len)
      offset += len
    } else {
      offset += buf.write(key + '=' + val, offset)
    }

    buf[oldOffset] = offset - oldOffset - 1
  })

  return buf
}

exports.decode = function (buf) {
  var data = {}
  var offset = 0
  var len = buf.length

  while (offset < len) {
    var b = decodeBlock(buf, offset)
    var i = bindexOf(b, equalSign)
    offset += decodeBlock.bytes

    if (b.length === 0) continue // ignore: most likely a single zero byte
    if (i === -1) data[b.toString().toLowerCase()] = true
    else if (i === 0) continue // ignore: invalid key-length
    else {
      var key = b.slice(0, i).toString().toLowerCase()
      if (key in data) continue // ignore: overwriting not allowed
      data[key] = b.slice(i + 1)
    }
  }

  return data
}

exports.encodingLength = function (data) {
  if (!data) return 1 // 1 byte (single empty byte)
  var keys = Object.keys(data)
  if (keys.length === 0) return 1 // 1 byte (single empty byte)
  return keys.reduce(function (total, key) {
    var val = data[key]
    total += Buffer.byteLength(key) + 1 // +1 byte to store field length
    if (Buffer.isBuffer(val)) total += val.length + 1 // +1 byte to fit equal sign
    else if (val !== true) total += Buffer.byteLength(String(val)) + 1 // +1 byte to fit equal sign
    return total
  }, 0)
}

function decodeBlock (buf, offset) {
  var len = buf[offset]
  var b = buf.slice(offset + 1, offset + 1 + len)
  decodeBlock.bytes = len + 1
  return b
}
