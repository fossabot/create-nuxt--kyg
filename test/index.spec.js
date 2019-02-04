'use strict'

const test = require('ava')
const sao = require('sao')
const { opts, answers } = require('./_variables')

test('1. Project Information', async t => {
  const stream = await sao.mock(opts, answers)
  const fileList = stream.fileList

  /* README.md */
  t.true(fileList.includes('README.md'))
  await stream.readFile('README.md').then((readMe) => {
    t.true(readMe.includes(`# ${answers.name}`))
    t.true(readMe.includes(`> ${answers.description}`))
  })

  /* LICENSE */
  t.true(fileList.includes('LICENSE'))
  await stream.readFile('LICENSE').then((license) => {
    t.true(license.includes('MIT License'))
  })

  /* package.json */
  t.true(fileList.includes('package.json'))
  await stream.readFile('package.json').then((pkg) => {
    const p = JSON.parse(pkg)
    t.is(p.version, '0.1.0')
  })
})
