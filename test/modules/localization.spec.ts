'use strict'

import test from 'ava'
import sao from 'sao'
import { answers, opts } from '../../bin/config'

test('Localization Module Test', async t => {
  const answer = Object.assign({}, answers, { nuxtModules: ['nuxt-i18n'] })
  const stream = await sao.mock(opts, answer)

  /* dependency check */
  await stream.readFile('package.json').then((packageJson) => {
    const pkg = JSON.parse(packageJson)
    t.true((typeof pkg.dependencies['nuxt-i18n']) !== 'undefined')
  })

  /* locale file check */
  await stream.readFile('src/assets/locale/en-US.js').then((lang) => {
    t.is(lang, "export default {\n  title: 'Hello Vue!'\n}\n")
  })

  /* vue file check */
  await stream.readFile('src/pages/index.vue').then((idx) => {
    t.true(idx.includes("<h1>{{ $t('title') }}</h1>"))
  })
})
