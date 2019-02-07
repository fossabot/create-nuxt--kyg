/* tslint:disable:object-literal-sort-keys */
'use strict'

import { resolve } from 'path'

export const opts = {
  generator: resolve(__dirname, '..', 'generator')
}

export const answers = {
  name: 'hello-world',
  description: '',
  license: 'MIT'
}

export const cli = {...opts, outDir: resolve(process.argv[2] || '.')}
