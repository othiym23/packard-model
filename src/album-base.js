import assert from 'assert'
import { join } from 'path'

export default class Album {
  constructor (name, artist, optional = {}) {
    assert(name, 'must pass an album name')
    assert(artist && artist.name, 'must pass an artist with a name')

    this.name = name
    this.artist = artist
    this.path = optional.path || ''
    this.date = optional.date || null
    this.pictures = optional.pictures || []
  }

  getSize () { return 0 }

  getDate () { return this.date }

  toSafePath () {
    let name = ''

    const date = this.getDate()
    if (date) name += '[' + date + '] '

    name += this.name
    return join(
      this._safe(this.artist.name),
      this._safe(name)
    )
  }

  _safe (string) {
    return ('' + (string || '')).replace(/[^ \]\[A-Za-z0-9-]/g, '')
  }
}
