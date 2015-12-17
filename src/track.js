import sanitize from 'sanitize-filename'
import sprintf from 'sprintf'

import Album from './album-base.js'
import Artist from './artist.js'
import AudioFile from './audio-file.js'

const DEFAULT_ARTIST = new Artist('[unknown]')
const DEFAULT_ALBUM = new Album('[untitled]', DEFAULT_ARTIST)

export default class Track {
  constructor (
    name = '[untitled]',
    album = DEFAULT_ALBUM,
    artist = DEFAULT_ARTIST,
    optional = {}
  ) {
    this.artist = artist
    this.album = album
    this.name = name

    if (optional.file) {
      this.file = optional.file
    } else if (optional.path && optional.stats) {
      this.file = new AudioFile(
        optional.path,
        optional.stats
      )
      this.file.ext = optional.ext || '.unknown'
    } else {
      this.file = null
    }

    this.index = optional.index || 0
    this.disc = optional.disc || 0
    this.date = optional.date
    this.duration = optional.duration

    if (Object.keys(optional.tags || {}).length > 0) {
      this.tags = optional.tags
      if (this.tags.index) this.index = parseInt(this.tags.index, 10)
      if (this.tags.disc) this.disc = parseInt(this.tags.disc, 10)
      if (this.tags.date) this.date = this.tags.date
    } else {
      this.tags = null
    }

    if (Object.keys(optional.musicbrainzTags || {}).length > 0) {
      this.musicbrainzTags = optional.musicbrainzTags
    } else {
      this.musicbrainzTags = null
    }

    this.sourceArchive = optional.sourceArchive || null
    this.fsTrack = optional.fsTrack || null
    this.fsAlbum = optional.fsAlbum || null
    this.fsArtist = optional.fsArtist || null
  }

  getSize (bs) {
    return this.file && this.file.getSize(bs) || 0
  }

  safeName () {
    return sanitize(this.fullName())
  }

  fullName () {
    let name = ''
    if (this.index) {
      if (this.disc) name += sprintf('%02d.', this.disc)
      name += sprintf('%02d - ', this.index)
    }
    if (this.artist) name += this.artist.name + ' - '
    if (this.album) name += this.album.name + ' - '
    name += this.name
    if (this.file && this.file.ext) name += this.file.ext
    return name
  }
}
