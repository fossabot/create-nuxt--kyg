/* tslint:disable:object-literal-sort-keys */
'use strict'

import test from 'ava'
import sao from 'sao'
import { answers, opts } from '../bin/config'

test('1. Nuxt.JS', async t => {
  const answer = Object.assign({}, answers, { language: 'js' })
  const stream = await sao.mock(opts, answer)

  await stream.readFile('package.json').then((pkg) => {
    const js = JSON.parse(pkg)
    t.true((typeof js.dependencies.nuxt) !== 'undefined')
    t.true((typeof js.devDependencies.eslint) !== 'undefined')
    t.deepEqual(js.scripts, {
      build: 'npx nuxt build',
      start: 'npx nuxt start',
      dev: 'npx nuxt',
    })
  })

  await stream.readFile('nuxt.config.js').then((conf) => {
    t.true(conf.includes('module.exports = {'))
  })
})

test('2. Nuxt.JS for Typescript', async t => {
  const answer = Object.assign({}, answers, { language: 'ts' })
  const stream = await sao.mock(opts, answer)

  await stream.readFile('package.json').then((pkg) => {
    const ts = JSON.parse(pkg)
    t.true((typeof ts.dependencies['nuxt-ts']) !== 'undefined')
    t.true((typeof ts.devDependencies.tslint) !== 'undefined')
    t.deepEqual(ts.scripts, {
      build: 'npx nuxt-ts build',
      start: 'npx nuxt-ts start',
      dev: 'npx nuxt-ts',
    })
  })

  await stream.readFile('nuxt.config.ts').then((conf) => {
    t.true(conf.includes('export default {'))
  })
})
