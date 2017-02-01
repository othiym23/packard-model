import assert from 'assert'
import { basename, extname } from 'path'

export default class File {
  constructor (path, stats, ext = extname(path)) {
    assert(typeof path === 'string', 'must pass file path')
    assert(stats && typeof stats === 'object', 'must pass file stats')
    this.path = path
    this.stats = stats
    this.ext = ext

    // derived properties
    this.name = basename(path, this.ext)
  }

  fullName () {
    return this.path
  }

  safeName () {
    return this.name.replace(/[^ ()\][A-Za-z0-9.-]/g, '')
  }

  getSize (bs = 1) {
    return Math.ceil((this.stats.size || 0) / bs)
  }
}
