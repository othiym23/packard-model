import assert from 'assert'
import { extname } from 'path'

import File from './file.js'

export default class Cover extends File {
  constructor (path, stats) {
    assert(path, 'must pass path to cover')
    assert(stats, 'must pass stats for cover')

    const extension = extname(path)
    super(path, stats, extension)
    this.format = (extension || '.unknown').slice(1)
  }
}
