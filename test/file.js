var test = require('tap').test

var File = require('../').File

test('basic contract', function (t) {
  var f
  t.throws(function () {
    f = new File()
  }, 'must include at least a path')

  t.throws(function () {
    f = new File('/tmp/a')
  }, 'must include stats as well')

  t.throws(function () {
    f = File('/tmp/a', { size: 0 })
  }, 'must be called as a constructor')

  t.notOk(f, 'should not end up with a file')

  t.doesNotThrow(function () {
    f = new File('/tmp/a', {})
    t.equal(f.path, '/tmp/a', 'path is unchanged')
    t.same(f.stats, {}, 'stats are unchanged')
    t.equal(f.ext, '', 'file has no extension')
    t.equal(f.name, 'a', 'file has name')
    t.equal(f.fullName(), '/tmp/a', 'full name is path for base class')
    t.equal(f.safeName(), 'a', 'safe name is base name')
    t.equal(f.getSize(), 0, 'file has no size')
  })
  t.end()
})

test('more complete example', function (t) {
  var path = '/tmp/path/Sigue Sigue Sputnik - 01 - Flaunt It! - Love Missile "F1-11" [Re-recording Part II].flac'
  var f = new File(path, { size: 32124128 }, '.flac')

  t.equal(f.path, path)
  t.same(f.stats, { size: 32124128 })
  t.equal(f.ext, '.flac')
  t.equal(f.name, 'Sigue Sigue Sputnik - 01 - Flaunt It! - Love Missile "F1-11" [Re-recording Part II]')
  t.equal(f.fullName(), path)
  t.equal(f.safeName(), 'Sigue Sigue Sputnik - 01 - Flaunt It - Love Missile F1-11 [Re-recording Part II]')
  t.equal(f.getSize(512), 62743, 'block size calculated correctly')

  t.end()
})
