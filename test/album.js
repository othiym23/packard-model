var test = require('tap').test

var model = require('../')
var Album = model.Album
var Artist = model.Artist
var Cover = model.Cover

test('base album missing information', function (t) {
  var album
  var artist = new Artist('Test Artist')

  t.throws(function () {
    album = new Album('Test Name')
  }, "can't create new album without an artist")

  t.throws(function () {
    album = new Album('Test Name', 'Test Artist')
  }, "can't create new album without an artist that's an object")

  t.throws(function () {
    album = new Album('Test Name', {})
  }, "can't create new album without a named artist")

  t.throws(function () {
    album = new Album(undefined, artist)
  }, "can't create new album without a name")

  t.throws(function () {
    album = Album('Test Name', artist)
  }, "can't invoke Album as a plain function")

  t.notOk(album, "album doesn't get set because of failures")

  t.end()
})

test('simplest base case', function (t) {
  var al = new Album('"Flaunt It!"', new Artist('Sigue Sigue Sputnik'))

  t.equal(al.name, '"Flaunt It!"')
  t.ok(al.artist)
  t.equal(al.artist.name, 'Sigue Sigue Sputnik')
  t.notOk(al.path)
  t.notOk(al.date)
  t.equal(al.pictures.length, 0)

  t.equal(al.getSize(), 0, 'abstract albums always have a size of 0')
  t.notOk(al.getDate())
  t.equal(al.toSafePath(), 'Sigue Sigue Sputnik/Flaunt It')

  t.end()
})

test('complete album example', function (t) {
  var al = new Album(
    '"Flaunt It!"',
    new Artist('Sigue Sigue Sputnik'),
    {
      path: '/tmp/Sigue Sigue Sputnik - Flaunt It',
      date: '1986',
      pictures: [new Cover(
        '/tmp/Sigue Sigue Sputnik - Flaunt It/cover.jpeg',
        { size: 32768 }
      )]
    }
  )

  t.equal(al.name, '"Flaunt It!"')
  t.ok(al.artist)
  t.equal(al.artist.name, 'Sigue Sigue Sputnik')
  t.equal(al.path, '/tmp/Sigue Sigue Sputnik - Flaunt It')
  t.equal(al.date, '1986')
  t.equal(al.pictures.length, 1)
  t.equal(al.pictures[0].path, '/tmp/Sigue Sigue Sputnik - Flaunt It/cover.jpeg')

  t.equal(al.getSize(), 0, 'abstract albums always have a size of 0')
  t.equal(al.getDate(), '1986', 'default date function returns passed date')
  t.equal(al.toSafePath(), 'Sigue Sigue Sputnik/[1986] Flaunt It')

  t.end()
})

test('_safe is safe', function (t) {
  var al = new Album('"Flaunt It!"', new Artist('Sigue Sigue Sputnik'))
  t.equal(al._safe(null), '')
  t.equal(al._safe(undefined), '')
  t.equal(al._safe(''), '')
  t.equal(al._safe(8), '8')
  t.end()
})
