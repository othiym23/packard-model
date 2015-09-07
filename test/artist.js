var test = require('tap').test

var models = require('../')
var Artist = models.Artist
var SingletrackAlbum = models.SingletrackAlbum
var Track = models.Track

test('artist missing information', function (t) {
  var artist

  t.throws(function () {
    artist = new Artist()
  }, "can't create new artist without a name")

  t.throws(function () {
    artist = Artist('Test Artist')
  }, 'must be called as a constructor')

  t.notOk(artist, "artist doesn't get set because of failures")

  t.end()
})

test('simplest working artist', function (t) {
  var artist = new Artist('Test Artist')
  t.equal(artist.name, 'Test Artist')
  t.equal(artist.albums.length, 0)
  t.equal(artist.otherTracks.length, 0)
  t.equal(artist.getSize(), 0)
  t.end()
})

test('artist with album', function (t) {
  var artist = new Artist(
    'Artist with Album',
    {
      albums: [new SingletrackAlbum(
        'Test Album',
        new Artist('Test Artist'),
        {
          path: '/tmp/Artist with Album',
          stats: { size: 1740 }
        }
      )]
    }
  )
  t.equal(artist.name, 'Artist with Album')

  t.equal(artist.albums.length, 1)
  t.equal(
    artist.albums[0].artist,
    artist,
    'adding an album to an artist sets it to that artist'
  )

  t.equal(artist.otherTracks.length, 0)
  t.equal(artist.getSize(), 1740)
  t.equal(artist.getSize(512), 4)

  t.end()
})

test('artist with other tracks', function (t) {
  var artist = new Artist(
    'Artist with Other Tracks',
    {
      otherTracks: [new Track()]
    }
  )
  t.equal(artist.name, 'Artist with Other Tracks')

  t.equal(artist.albums.length, 0)

  t.equal(artist.otherTracks.length, 1)
  t.equal(
    artist.otherTracks[0].artist,
    artist,
    'adding a track to an artist sets it to that artist'
  )

  t.equal(artist.getSize(), 0)
  t.equal(artist.getSize(512), 0)

  t.end()
})

test('artist adding other tracks', function (t) {
  var artist = new Artist('Artist with Other Tracks')
  artist.addOtherTracks([
    new Track(),
    new Track()
  ])
  t.equal(artist.name, 'Artist with Other Tracks')

  t.equal(artist.albums.length, 0)

  t.equal(artist.otherTracks.length, 2)
  t.equal(
    artist.otherTracks[0].artist,
    artist,
    'adding a track to an artist sets it to that artist'
  )
  t.equal(
    artist.otherTracks[1].artist,
    artist,
    'adding a track to an artist sets it to that artist'
  )

  t.equal(artist.getSize(), 0)
  t.equal(artist.getSize(512), 0)

  t.end()
})
