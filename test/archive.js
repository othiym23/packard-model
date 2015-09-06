var test = require('tap').test

var Archive = require('../').Archive

test('basic contract', function (t) {
  var f
  t.throws(function () {
    f = new Archive()
  }, 'must include at least a path')

  t.throws(function () {
    f = new Archive('/tmp/a')
  }, 'must include stats as well')

  t.throws(function () {
    f = Archive('/tmp/a', { size: 0 })
  }, 'must be called as a constructor')

  t.notOk(f, 'should not end up with an archive')

  t.doesNotThrow(function () {
    f = new Archive('/tmp/a', {})
    t.equal(f.path, '/tmp/a', 'path is unchanged')
    t.same(f.stats, {}, 'stats are unchanged')
    t.same(f.info, {}, 'info is default')
    t.equal(f.ext, '', 'archive has no extension')
    t.equal(f.name, 'a', 'archive has name')
    t.equal(f.fullName(), '/tmp/a', 'full name is path for base class')
    t.equal(f.safeName(), 'a', 'safe name is base name')
    t.equal(f.getSize(), 0, 'archive has no size')
  })
  t.end()
})

test('more complete example', function (t) {
  var path = '/tmp/path/Sigue Sigue Sputnik - "Flaunt It!".zip'
  var f = new Archive(path, { size: 125174323 }, { entries: 3 })

  t.equal(f.path, path)
  t.same(f.stats, { size: 125174323 })
  t.same(f.info, { entries: 3 })
  t.equal(f.ext, '.zip')
  t.equal(f.name, 'Sigue Sigue Sputnik - "Flaunt It!"')
  t.equal(f.fullName(), path)
  t.equal(f.safeName(), 'Sigue Sigue Sputnik - Flaunt It')
  t.equal(f.getSize(512), 244482, 'block size calculated correctly')

  t.end()
})
