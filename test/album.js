var test = require('tap').test

var models = require('../')
var Artist = models.Artist
var BaseAlbum = models.Album
var Cover = models.Cover
var MultitrackAlbum = models.MultitrackAlbum
var Track = models.Track

test('base album missing information', function (t) {
  var album

  t.throws(function () {
    album = new BaseAlbum(undefined, 'Test Artist')
  }, "can't create new album without a name")

  t.throws(function () {
    album = new BaseAlbum('Test Name')
  }, "can't create new album without an artist name")

  t.notOk(album, "album doesn't get set because of failures")

  t.end()
})

test('multitrack album base case', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var album = new MultitrackAlbum('Skiffle Bloodbath', artist)
  t.equal(album.getSize(), 0, 'nothing to a new album')
  t.equal(
    album.toPath(),
    'Gerry  The Pacemakers/Skiffle Bloodbath',
    'empty album still has a title'
  )
  t.equal(
    album.dump(),
    'Gerry  The Pacemakers/Skiffle Bloodbath/\n',
    'simple album dump includes new path and original path (if set)'
  )

  t.end()
})

test('multitrack album with tracks', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var album = new MultitrackAlbum(
    'Skiffle Bloodbath',
    artist,
    undefined,
    [new Track(
      artist,
      new MultitrackAlbum(
        'Skiffle Bloodbath',
        new Artist('The Beatles')
      ),
      "Everybody Let's Booze Up and Riot",
      {
        path: '-',
        stats: {
          size: 1,
          blockSize: 512,
          blocks: 1
        }
      }
    )]
  )
  t.equal(album.getSize(), 1, 'only tracks adding size to new album')
  t.equal(
    album.toPath(),
    'Gerry  The Pacemakers/Skiffle Bloodbath',
    'empty album still has a title'
  )
  t.equal(
    album.dump(),
    'Gerry  The Pacemakers/Skiffle Bloodbath/\n' +
      '   Gerry  The Pacemakers - Skiffle Bloodbath - Everybody Lets Booze Up and Riot.unknown\n',
    'album dump includes tracks'
  )

  t.end()
})

test('multitrack album with cover', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var album = new MultitrackAlbum('Skiffle Bloodbath', artist)
  album.pictures.push(new Cover('cover.jpg', {size: 513, blockSize: 512, blocks: 1}))
  t.equal(album.getSize(), 513, 'only cover size to new album')
  t.equal(
    album.toPath(),
    'Gerry  The Pacemakers/Skiffle Bloodbath',
    'empty album still has a title'
  )
  t.equal(
    album.dump(),
    'Gerry  The Pacemakers/Skiffle Bloodbath/\n' +
      'c: Gerry  The Pacemakers/Skiffle Bloodbath/cover.jpg\n',
    'simple album dump includes new path and original path (if set)'
  )

  t.end()
})
