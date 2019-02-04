'use strict'

const path = require('path')

module.exports.opts = { generator: path.join(__dirname, '..', 'generator') }

module.exports.answers = {
  name: 'hello-world',
  description: '',
  license: 'MIT'
}
