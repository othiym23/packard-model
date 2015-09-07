import assert from 'assert'

export default class Artist {
  constructor (name, optional = {}) {
    assert(name, 'must pass artist name')
    this.name = name

    this.albums = optional.albums || []
    this.otherTracks = optional.otherTracks || []

    this._syncArtists()
  }

  addOtherTracks (tracks) {
    this.otherTracks = this.otherTracks.concat(tracks)
    this._syncArtists()
  }

  getSize (bs = 1) {
    return this.albums.reduce((t, a) => t + a.getSize(bs), 0) +
           this.otherTracks.reduce((total, track) => total + track.getSize(bs), 0)
  }

  _syncArtists () {
    for (let album of this.albums) album.artist = this
    for (let track of this.otherTracks) track.artist = this
  }
}
