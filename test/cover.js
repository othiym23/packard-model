var test = require('tap').test

var Cover = require('../').Cover

test('basic contract', function (t) {
  var f
  t.throws(function () {
    f = new Cover()
  }, 'must include at least a path')

  t.throws(function () {
    f = new Cover('/tmp/a')
  }, 'must include stats as well')

  t.throws(function () {
    f = Cover('/tmp/a', { size: 0 })
  }, 'must be called as a constructor')

  t.notOk(f, 'should not end up with a cover')

  t.doesNotThrow(function () {
    f = new Cover('/tmp/a', {})
    t.equal(f.path, '/tmp/a', 'path is unchanged')
    t.same(f.stats, {}, 'stats are unchanged')
    t.equal(f.format, 'unknown', 'format is unknown')
    t.equal(f.ext, '', 'cover has no extension')
    t.equal(f.name, 'a', 'cover has name')
    t.equal(f.fullName(), '/tmp/a', 'full name is path')
    t.equal(f.safeName(), 'a', 'safe name is base name')
    t.equal(f.getSize(), 0, 'cover has no size')
  })
  t.end()
})

test('more complete example', function (t) {
  var path = '/tmp/path/Sigue Sigue Sputnik - "Flaunt It!".png'
  var f = new Cover(path, { size: 777111 })

  t.equal(f.path, path)
  t.same(f.stats, { size: 777111 })
  t.equal(f.format, 'png')
  t.equal(f.ext, '.png')
  t.equal(f.name, 'Sigue Sigue Sputnik - "Flaunt It!"')
  t.equal(f.fullName(), path)
  t.equal(f.safeName(), 'Sigue Sigue Sputnik - Flaunt It')
  t.equal(f.getSize(512), 1518, 'block size calculated correctly')

  t.end()
})
