import { basename, join } from 'path'

import sanitize from 'sanitize-filename'

import Album from './album-base.js'
import Artist from './artist.js'
import AudioFile from './audio-file.js'

export default class SingletrackAlbum extends Album {
  constructor (name, artist, optional = {}) {
    super(name, artist, optional)

    this.cuesheet = optional.cuesheet || null

    if (optional.file) {
      this.file = optional.file
    } else if (optional.path && optional.stats) {
      this.file = new AudioFile(
        optional.path,
        optional.stats
      )
    } else {
      this.file = null
    }
  }

  get path () { return this.file && this.file.path }

  set path (p) {
    if (this.file) this.file.path = p
  }

  getSize (bs = 1) {
    return this.file && this.file.getSize(bs) || 0
  }

  toSafePath () {
    let name = this.artist.name + ' - '

    const date = this.getDate()
    if (date) name += '[' + date + '] '

    if (this.file) {
      name = sanitize(name + basename(this.name, this.file.ext))
      name += this.file.ext
    } else {
      name = sanitize(name + this.name)
    }

    return join(sanitize(this.artist.name), name)
  }

  dump () {
    let dumped = this.toSafePath() + '\n'

    for (let cover of this.pictures) {
      dumped += 'c: ' + join(sanitize(this.artist.name), basename(cover.path)) + '\n'
    }
    if (this.file) dumped += '(currently at ' + this.file.path + ')\n'

    return dumped
  }

  static fromTrack (track) {
    return new SingletrackAlbum(
      track.name,
      new Artist(track.album.name),
      { file: track.file }
    )
  }
}
