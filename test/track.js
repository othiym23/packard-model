var test = require('tap').test

var model = require('../')
var Artist = model.Artist
var AudioFile = model.AudioFile
var SingletrackAlbum = model.SingletrackAlbum
var Track = model.Track

test('you need very little to start with a track', function (t) {
  var track
  t.throws(function () {
    track = Track()
  }, 'but you need to invoke it as a constructor')
  t.notOk(track, 'should have no track due to failure')

  track = new Track()
  t.equal(track.name, '[untitled]')
  t.equal(track.album.name, '[untitled]')
  t.equal(track.artist.name, '[unknown]')
  t.equal(track.index, 0)
  t.equal(track.disc, 0)
  t.equal(track.getSize(), 0)
  t.equal(track.getSize(512), 0)
  t.equal(track.fullName(), '[unknown] - [untitled] - [untitled]')
  t.equal(track.safeName(), '[unknown] - [untitled] - [untitled]')

  var onlyName = new Track('Only Name')
  t.equal(onlyName.name, 'Only Name')
  t.equal(onlyName.album.name, '[untitled]')
  t.equal(onlyName.artist.name, '[unknown]')
  t.equal(onlyName.index, 0)
  t.equal(onlyName.disc, 0)
  t.equal(onlyName.getSize(), 0)
  t.equal(onlyName.getSize(512), 0)
  t.equal(onlyName.fullName(), '[unknown] - [untitled] - Only Name')
  t.equal(onlyName.safeName(), '[unknown] - [untitled] - Only Name')

  var noArtistOrAlbum = new Track('Only Name', null, null)
  t.equal(noArtistOrAlbum.name, 'Only Name')
  t.notOk(noArtistOrAlbum.album)
  t.notOk(noArtistOrAlbum.artist)
  t.equal(noArtistOrAlbum.index, 0)
  t.equal(noArtistOrAlbum.disc, 0)
  t.equal(noArtistOrAlbum.getSize(), 0)
  t.equal(noArtistOrAlbum.getSize(512), 0)
  t.equal(noArtistOrAlbum.fullName(), 'Only Name')
  t.equal(noArtistOrAlbum.safeName(), 'Only Name')

  t.end()
})

test('other data', function (t) {
  var mbartist = new Artist('MBArtist')
  var mbalbum = new SingletrackAlbum('MBAlbum', mbartist)
  var mbtrack = new Track(
    'From Musicbrainz',
    mbalbum,
    mbartist,
    {
      file: new AudioFile('/tmp/track.mp3', { size: 1234 }),
      index: 1,
      disc: 1,
      musicbrainzTags: { MB_ALBUM_ID: '1111-222-3333-44444' }
    }
  )
  t.equal(mbtrack.name, 'From Musicbrainz')
  t.equal(mbtrack.album.name, 'MBAlbum')
  t.equal(mbtrack.artist.name, 'MBArtist')
  t.equal(mbtrack.index, 1)
  t.equal(mbtrack.disc, 1)
  t.equal(mbtrack.getSize(), 1234)
  t.equal(mbtrack.getSize(512), 3)
  t.equal(mbtrack.fullName(), '01.01 - MBArtist - MBAlbum - From Musicbrainz.mp3')
  t.equal(mbtrack.safeName(), '01.01 - MBArtist - MBAlbum - From Musicbrainz.mp3')

  var flacartist = new Artist('FLACArtist')
  var flacalbum = new SingletrackAlbum('FLACAlbum', flacartist)
  var flactrack = new Track(
    'FLACTrack',
    flacalbum,
    flacartist,
    {
      file: new AudioFile('/tmp/track.flac', { size: 1234 }),
      index: 1,
      disc: 1,
      tags: {
        index: 1,
        disc: 1,
        title: 'FLACTrack',
        artist: 'FLACArtist',
        album: 'FLACAlbum'
      }
    }
  )
  t.equal(flactrack.name, 'FLACTrack')
  t.equal(flactrack.album.name, 'FLACAlbum')
  t.equal(flactrack.artist.name, 'FLACArtist')
  t.equal(flactrack.index, 1)
  t.equal(flactrack.disc, 1)
  t.equal(flactrack.getSize(), 1234)
  t.equal(flactrack.getSize(512), 3)
  t.equal(flactrack.fullName(), '01.01 - FLACArtist - FLACAlbum - FLACTrack.flac')
  t.equal(flactrack.safeName(), '01.01 - FLACArtist - FLACAlbum - FLACTrack.flac')

  t.end()
})
