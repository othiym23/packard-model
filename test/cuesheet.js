var test = require('tap').test

var Cuesheet = require('../').Cuesheet

test('basic contract', function (t) {
  var f
  t.throws(function () {
    f = new Cuesheet()
  }, 'must include at least a path')

  t.throws(function () {
    f = new Cuesheet('/tmp/a')
  }, 'must include stats as well')

  t.throws(function () {
    f = Cuesheet('/tmp/a', { size: 0 })
  }, 'must be called as a constructor')

  t.notOk(f, 'should not end up with a cuesheet')

  t.doesNotThrow(function () {
    f = new Cuesheet('/tmp/a', {})
    t.equal(f.path, '/tmp/a', 'path is unchanged')
    t.same(f.stats, {}, 'stats are unchanged')
    t.equal(f.ext, '', 'cuesheet has no extension')
    t.equal(f.name, 'a', 'cuesheet has name')
    t.equal(f.fullName(), '/tmp/a', 'full name is path for base class')
    t.equal(f.safeName(), 'a', 'safe name is base name')
    t.equal(f.getSize(), 0, 'cuesheet has no size')
  })
  t.end()
})

test('more complete example', function (t) {
  var path = '/tmp/path/Sigue Sigue Sputnik - "Flaunt It!".cue'
  var f = new Cuesheet(path, { size: 32768 }, '.cue')

  t.equal(f.path, path)
  t.same(f.stats, { size: 32768 })
  t.equal(f.ext, '.cue')
  t.equal(f.name, 'Sigue Sigue Sputnik - "Flaunt It!"')
  t.equal(f.fullName(), path)
  t.equal(f.safeName(), 'Sigue Sigue Sputnik - Flaunt It')
  t.equal(f.getSize(512), 64, 'block size calculated correctly')

  t.end()
})
