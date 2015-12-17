var test = require('tap').test

var model = require('../')
var Artist = model.Artist
var AudioFile = model.AudioFile
var Cover = model.Cover
var SingletrackAlbum = model.SingletrackAlbum
var Track = model.Track

test('single-track album missing information', function (t) {
  var album
  var artist = new Artist('Test Artist')

  t.throws(function () {
    album = new SingletrackAlbum('Test Name')
  }, "can't create new album without an artist")

  t.throws(function () {
    album = new SingletrackAlbum('Test Name', 'Test Artist')
  }, "can't create new album without an artist that's an object")

  t.throws(function () {
    album = new SingletrackAlbum('Test Name', {})
  }, "can't create new album without a named artist")

  t.throws(function () {
    album = new SingletrackAlbum(undefined, artist)
  }, "can't create new album without a name")

  t.throws(function () {
    album = SingletrackAlbum('Test Name', artist)
  }, "can't invoke SingletrackAlbum as a plain function")

  t.notOk(album, "album doesn't get set because of failures")

  t.end()
})

test('single-track album with no file', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var album = new SingletrackAlbum('Skiffle Bloodbath', artist)
  t.equal(album.getSize(), 0, 'nothing to a new album')
  t.equal(
    album.toSafePath(),
    'Gerry & The Pacemakers/Gerry & The Pacemakers - Skiffle Bloodbath',
    'empty album still has a title'
  )
  t.equal(
    album.dump(),
    'Gerry & The Pacemakers/Gerry & The Pacemakers - Skiffle Bloodbath\n',
    'simple album dump includes new path and original path (if set)'
  )

  t.end()
})

test('single-track album with a file', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var file = new AudioFile(
    '/tmp/Gerry & The Pacemakers - Skiffle Bloodbath.mp3',
    { size: 14000 }
  )
  var album = new SingletrackAlbum('Skiffle Bloodbath', artist, { file: file })
  t.equal(album.getSize(), 14000, 'has a size through the file')
  t.equal(album.getSize(32768), 1)
  t.equal(album.path, '/tmp/Gerry & The Pacemakers - Skiffle Bloodbath.mp3')
  t.equal(
    album.toSafePath(),
    'Gerry & The Pacemakers/Gerry & The Pacemakers - Skiffle Bloodbath.mp3'
  )
  t.equal(
    album.dump(),
    'Gerry & The Pacemakers/Gerry & The Pacemakers - Skiffle Bloodbath.mp3\n' +
      '(currently at /tmp/Gerry & The Pacemakers - Skiffle Bloodbath.mp3)\n',
    'simple album dump includes new path and original path (if set)'
  )

  t.end()
})

test('single-track album with path and stats', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var album = new SingletrackAlbum(
    'Skiffle Bloodbath',
    artist,
    {
      path: '/tmp/Gerry & The Pacemakers - Skiffle Bloodbath.mp3',
      stats: { size: 14000 }
    }
  )
  t.equal(album.getSize(), 14000, 'has a size through the file')
  t.equal(album.getSize(32768), 1)
  t.equal(album.path, '/tmp/Gerry & The Pacemakers - Skiffle Bloodbath.mp3')

  album.path = '/tmp/a'
  t.equal(album.path, '/tmp/a', 'can change path on associated file')
  t.equal(
    album.toSafePath(),
    'Gerry & The Pacemakers/Gerry & The Pacemakers - Skiffle Bloodbath.mp3'
  )
  t.equal(
    album.dump(),
    'Gerry & The Pacemakers/Gerry & The Pacemakers - Skiffle Bloodbath.mp3\n' +
      '(currently at /tmp/a)\n',
    'simple album dump includes new path and original path (if set)'
  )

  t.end()
})

test('single-track album with path and date but no stats', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var album = new SingletrackAlbum(
    'Skiffle Bloodbath',
    artist,
    {
      path: '/tmp/Gerry & The Pacemakers - Skiffle Bloodbath.mp3',
      date: '1963-07-01'
    }
  )
  t.equal(album.getSize(), 0)
  t.equal(album.getSize(32768), 0)
  t.equal(album.date, '1963-07-01')
  t.notOk(album.file, 'files need path and stats')
  t.equal(
    album.toSafePath(),
    'Gerry & The Pacemakers/Gerry & The Pacemakers - [1963-07-01] Skiffle Bloodbath',
    'single-track albums really want to be associated with a file'
  )
  t.equal(
    album.dump(),
    'Gerry & The Pacemakers/Gerry & The Pacemakers - [1963-07-01] Skiffle Bloodbath\n',
    'simple album dump includes safe path'
  )

  t.end()
})

test('single-track album with a file and a cover', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var file = new AudioFile(
    '/tmp/Gerry & The Pacemakers - Skiffle Bloodbath.mp3',
    { size: 14000 }
  )
  var cover = new Cover(
    '/tmp/Gerry & The Pacemakers - Skiffle Bloodbath.png',
    { size: 32769 }
  )
  var album = new SingletrackAlbum(
    'Skiffle Bloodbath',
    artist,
    {
      file: file,
      pictures: [cover]
    }
  )
  t.equal(album.getSize(), 14000, 'has a size through the file')
  t.equal(album.getSize(32768), 1)
  t.equal(album.path, '/tmp/Gerry & The Pacemakers - Skiffle Bloodbath.mp3')
  t.equal(album.pictures.length, 1)
  t.equal(
    album.toSafePath(),
    'Gerry & The Pacemakers/Gerry & The Pacemakers - Skiffle Bloodbath.mp3'
  )
  t.equal(
    album.dump(),
    'Gerry & The Pacemakers/Gerry & The Pacemakers - Skiffle Bloodbath.mp3\n' +
      'c: Gerry & The Pacemakers/Gerry & The Pacemakers - Skiffle Bloodbath.png\n' +
      '(currently at /tmp/Gerry & The Pacemakers - Skiffle Bloodbath.mp3)\n',
    'simple album dump includes new path and original path (if set)'
  )

  t.end()
})

test('fromTrack works as expected', function (t) {
  // fromTrack is used by a filesystem scanner that comes in a level too
  // high in the path
  var whoopsArtist = new Artist('tmp')
  var album = new SingletrackAlbum('Gerry & The Pacemakers', whoopsArtist)
  var file = new AudioFile(
    '/tmp/Gerry & The Pacemakers/Skiffle Bloodbath.mp3',
    { size: 14000 }
  )
  var from = SingletrackAlbum.fromTrack(new Track(
    'Skiffle Bloodbath.mp3',
    album,
    whoopsArtist,
    { file: file }
  ))

  t.equal(from.name, 'Skiffle Bloodbath.mp3')
  t.equal(from.getSize(), 14000, 'has a size through the file')
  t.equal(from.getSize(32768), 1)
  t.equal(from.path, '/tmp/Gerry & The Pacemakers/Skiffle Bloodbath.mp3')
  t.equal(
    from.toSafePath(),
    'Gerry & The Pacemakers/Gerry & The Pacemakers - Skiffle Bloodbath.mp3'
  )
  t.equal(
    from.dump(),
    'Gerry & The Pacemakers/Gerry & The Pacemakers - Skiffle Bloodbath.mp3\n' +
      '(currently at /tmp/Gerry & The Pacemakers/Skiffle Bloodbath.mp3)\n',
    'simple album dump includes new path and original path (if set)'
  )

  t.end()
})
