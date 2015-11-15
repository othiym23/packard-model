// oh iterables
import 'babel-polyfill'

import { join, basename } from 'path'

import log from 'npmlog'

import Album from './album-base.js'

export default class MultitrackAlbum extends Album {
  constructor (name, artist, optional = {}) {
    super(name, artist, optional)

    this._tracks = optional.tracks || []
    this.sourceArchive = null
    this.destArchive = null
  }

  get tracks () {
    return this._tracks.sort((a, b) => (a.index || 0) - (b.index || 0))
  }

  set tracks (tracks) {
    this._tracks = tracks
  }

  getSize (bs = 1) {
    return this.tracks.reduce((t, track) => t + track.getSize(bs), 0) +
           this.pictures.reduce((c, cover) => c + cover.getSize(bs), 0)
  }

  getDate () {
    const dates = this.tracks.reduce((s, t) => s.add(t.date), new Set())
    if (dates.size > 1) {
      log.warn('album', 'tracks have inconsistent dates', [...dates])
    }

    return [...dates][0] || ''
  }

  dump () {
    let dumped = this.toSafePath() + '/\n'
    for (let track of this.tracks.sort((a, b) => (a.index || 0) - (b.index || 0))) {
      dumped += '   ' + track.safeName() + '\n'
    }

    for (let cover of this.pictures) {
      dumped += 'c: ' + join(this.toSafePath(), basename(cover.path)) + '\n'
    }
    if (this.path) dumped += '(unpacked to ' + this.path + ')\n'

    return dumped
  }
}
