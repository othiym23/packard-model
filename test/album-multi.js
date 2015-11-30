var test = require('tap').test

var model = require('../')
var Artist = model.Artist
var Cover = model.Cover
var MultitrackAlbum = model.MultitrackAlbum
var Track = model.Track

test('multitrack album missing information', function (t) {
  var album
  var artist = new Artist('Test Artist')

  t.throws(function () {
    album = new MultitrackAlbum('Test Name')
  }, "can't create new album without an artist")

  t.throws(function () {
    album = new MultitrackAlbum('Test Name', 'Test Artist')
  }, "can't create new album without an artist that's an object")

  t.throws(function () {
    album = new MultitrackAlbum('Test Name', {})
  }, "can't create new album without a named artist")

  t.throws(function () {
    album = new MultitrackAlbum(undefined, artist)
  }, "can't create new album without a name")

  t.throws(function () {
    album = MultitrackAlbum('Test Name', artist)
  }, "can't invoke MultitrackAlbum as a plain function")

  t.notOk(album, "album doesn't get set because of failures")

  t.end()
})

test('multitrack album base case', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var album = new MultitrackAlbum('Skiffle Bloodbath', artist)
  t.equal(album.getSize(), 0, 'nothing to a new album')
  t.equal(
    album.toSafePath(),
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

test('multitrack album with track', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var album = new MultitrackAlbum(
    'Skiffle Bloodbath',
    artist,
    {
      tracks: [new Track(
        "Everybody Let's Booze Up and Riot",
        new MultitrackAlbum(
          'Skiffle Bloodbath',
          new Artist('The Beatles')
        ),
        artist,
        {
          path: '-',
          stats: {
            size: 1,
            blockSize: 512,
            blocks: 1
          }
        }
      )]
    }
  )
  t.equal(album.getSize(), 1, 'only tracks adding size to new album')
  t.notOk(album.path)
  t.equal(
    album.toSafePath(),
    'Gerry  The Pacemakers/Skiffle Bloodbath',
    'empty album still has a title'
  )
  t.equal(
    album.dump(),
    'Gerry  The Pacemakers/Skiffle Bloodbath/\n' +
      '   Gerry  The Pacemakers - Skiffle Bloodbath - Everybody Lets Booze Up and Riot.unknown\n',
    'album dump includes tracks'
  )
  t.equal(album.getSize(), 1, 'still occupies 1 block even though only 1 byte long')

  t.end()
})

test('multitrack album with tracks with dates', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var album = new MultitrackAlbum(
    'Skiffle Bloodbath',
    artist,
    {
      path: '/tmp/Gerry & The Pacemakers/Skiffle Bloodbath',
      tracks: [new Track(
        "Everybody Let's Booze Up and Riot",
        new MultitrackAlbum(
          'Skiffle Bloodbath',
          new Artist('The Beatles')
        ),
        artist,
        {
          index: 1,
          date: '2014-11-04',
          path: '-',
          ext: '.mp3',
          stats: {
            size: 1,
            blockSize: 512,
            blocks: 1
          }
        }
      ),
      new Track(
        "Everybody Let's Booze Up and Riot [trance mix]",
        new MultitrackAlbum(
          'Skiffle Bloodbath',
          new Artist('The Beatles')
        ),
        artist,
        {
          index: 2,
          date: '2014-11-16',
          path: '-',
          ext: '.mp3',
          stats: {
            size: 1,
            blockSize: 512,
            blocks: 1
          }
        }
      )]
    }
  )
  t.equal(album.getSize(), 2, 'only tracks adding size to new album')
  t.equal(album.path, '/tmp/Gerry & The Pacemakers/Skiffle Bloodbath')
  t.equal(
    album.toSafePath(),
    'Gerry  The Pacemakers/[2014-11-04] Skiffle Bloodbath',
    'empty album still has a title'
  )
  t.equal(
    album.dump(),
    'Gerry  The Pacemakers/[2014-11-04] Skiffle Bloodbath/\n' +
      '   Gerry  The Pacemakers - Skiffle Bloodbath - 01 - Everybody Lets Booze Up and Riot.mp3\n' +
      '   Gerry  The Pacemakers - Skiffle Bloodbath - 02 - Everybody Lets Booze Up and Riot [trance mix].mp3\n' +
      '(unpacked to /tmp/Gerry & The Pacemakers/Skiffle Bloodbath)\n',
    'album dump includes tracks'
  )
  t.equal(album.getSize(512), 2, 'occupies 2 blocks even though each track is only 1 byte')

  t.end()
})

test('multi-disc album', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var album = new MultitrackAlbum(
    'Skiffle Bloodbath',
    artist,
    {
      path: '/tmp/Gerry & The Pacemakers/Skiffle Bloodbath',
      tracks: [new Track(
        "Everybody Let's Booze Up and Riot",
        new MultitrackAlbum(
          'Skiffle Bloodbath',
          new Artist('The Beatles')
        ),
        artist,
        {
          index: 1,
          path: '-',
          ext: '.mp3',
          tags: {
            disc: 1
          },
          stats: {
            size: 1,
            blockSize: 512,
            blocks: 1
          }
        }
      ),
      new Track(
        "Everybody Let's Booze Up and Riot [trance mix]",
        new MultitrackAlbum(
          'Skiffle Bloodbath',
          new Artist('The Beatles')
        ),
        artist,
        {
          index: 1,
          date: '2014-11-16',
          path: '-',
          ext: '.mp3',
          tags: {
            disc: 2
          },
          stats: {
            size: 1,
            blockSize: 512,
            blocks: 1
          }
        }
      )]
    }
  )
  t.equal(album.getSize(), 2, 'only tracks adding size to new album')
  t.equal(album.path, '/tmp/Gerry & The Pacemakers/Skiffle Bloodbath')
  t.equal(
    album.toSafePath(),
    'Gerry  The Pacemakers/Skiffle Bloodbath'
  )
  t.equal(
    album.dump(),
    'Gerry  The Pacemakers/Skiffle Bloodbath/\n' +
      '   Gerry  The Pacemakers - Skiffle Bloodbath - 01 - Everybody Lets Booze Up and Riot.mp3\n' +
      '   Gerry  The Pacemakers - Skiffle Bloodbath - 01 - Everybody Lets Booze Up and Riot [trance mix].mp3\n' +
      '(unpacked to /tmp/Gerry & The Pacemakers/Skiffle Bloodbath)\n',
    'album dump includes tracks'
  )
  t.equal(album.getSize(512), 2, 'occupies 2 blocks even though each track is only 1 byte')

  t.end()
})

test('multitrack album setting tracks after creation', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var album = new MultitrackAlbum(
    'Skiffle Bloodbath',
    artist,
    { path: '/tmp/Gerry & The Pacemakers/Skiffle Bloodbath' }
  )
  album.tracks = [
    new Track(
      "Everybody Let's Booze Up and Riot",
      album,
      artist,
      {
        date: '2014-11-04',
        path: '-',
        ext: '.mp3',
        stats: {
          size: 1,
          blockSize: 512,
          blocks: 1
        }
      }
    ),
    new Track(
      "Everybody Let's Booze Up and Riot [trance mix]",
      album,
      artist,
      {
        date: '2014-11-04',
        path: '-',
        ext: '.mp3',
        stats: {
          size: 1,
          blockSize: 512,
          blocks: 1
        }
      }
    )
  ]
  t.equal(album.getSize(), 2, 'only tracks adding size to new album')
  t.equal(album.path, '/tmp/Gerry & The Pacemakers/Skiffle Bloodbath')
  t.equal(
    album.toSafePath(),
    'Gerry  The Pacemakers/[2014-11-04] Skiffle Bloodbath',
    'empty album still has a title'
  )
  t.equal(
    album.dump(),
    'Gerry  The Pacemakers/[2014-11-04] Skiffle Bloodbath/\n' +
      '   Gerry  The Pacemakers - Skiffle Bloodbath - Everybody Lets Booze Up and Riot.mp3\n' +
      '   Gerry  The Pacemakers - Skiffle Bloodbath - Everybody Lets Booze Up and Riot [trance mix].mp3\n' +
      '(unpacked to /tmp/Gerry & The Pacemakers/Skiffle Bloodbath)\n',
    'album dump includes tracks'
  )
  t.equal(album.getSize(512), 2, 'occupies 2 blocks even though each track is only 1 byte')

  t.end()
})

test('multitrack album with cover', function (t) {
  var artist = new Artist('Gerry & The Pacemakers')
  var album = new MultitrackAlbum('Skiffle Bloodbath', artist)
  album.pictures.push(new Cover('cover.jpg', {size: 513, blockSize: 512, blocks: 1}))
  t.equal(album.getSize(), 513, 'only cover size to new album')
  t.equal(
    album.toSafePath(),
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
