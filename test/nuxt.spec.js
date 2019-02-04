'use strict'

const test = require('ava')
const sao = require('sao')
const { opts, answers } = require('./_variables')

test('2-1. Nuxt.JS', async t => {
  const answer = Object.assign({}, answers, { language: 'js' })
  const stream = await sao.mock(opts, answer)

  await stream.readFile('package.json').then((pkg) => {
    const js = JSON.parse(pkg)
    t.true((typeof js.dependencies.nuxt) !== 'undefined')
    t.true((typeof js.devDependencies['eslint']) !== 'undefined')
  })

  await stream.readFile('nuxt.config.js').then((conf) => {
    t.true(conf.includes('module.exports = {'))
  })
})

test('2-2. Nuxt.JS for Typescript', async t => {
  const answer = Object.assign({}, answers, { language: 'ts' })
  const stream = await sao.mock(opts, answer)

  await stream.readFile('package.json').then((pkg) => {
    const ts = JSON.parse(pkg)
    t.true((typeof ts.dependencies['nuxt-ts']) !== 'undefined')
    t.true((typeof ts.devDependencies['tslint']) !== 'undefined')
  })

  await stream.readFile('nuxt.config.ts').then((conf) => {
    t.true(conf.includes('export default {'))
  })
})
