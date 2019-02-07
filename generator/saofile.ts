/* tslint:disable:object-literal-sort-keys */
'use strict'

const nuxtVersion = '^2.4.0'

const dependencies = {
  js: {
    nuxt: nuxtVersion,
    dev: {
      eslint: '^5.12.1',
      '@babel/core': '^7.2.2',
      '@nuxt/babel-preset-app': '^2.3.4',
      '@nuxtjs/eslint-config': '^0.0.1',
      'babel-eslint': '^10.0.1',
      'eslint-config-prettier': '^3.6.0',
      'eslint-config-prettier-standard': '^2.0.0',
      'eslint-config-standard': '^12.0.0',
      'eslint-plugin-import': '^2.15.0',
      'eslint-plugin-jest': '^22.1.3',
      'eslint-plugin-node': '^8.0.1',
      'eslint-plugin-prettier': '^3.0.1',
      'eslint-plugin-promise': '^4.0.1',
      'eslint-plugin-standard': '^4.0.0',
      'eslint-plugin-vue': '^5.1.0'
    }
  },
  ts: {
    'nuxt-ts': nuxtVersion,
    dev: {
      tslint: '^5.12.1',
      'tslint-config-prettier': '^1.18.0',
      'tslint-config-standard': '^8.0.1'
    }
  }
}

const modules = {
  'nuxt-i18n': '^5.3.0'
}

// noinspection JSUnusedGlobalSymbols
module.exports = {
  templateData () {
    const { language } = this.answers

    return {
      username: this.gitUser.name,
      year: new Date().getFullYear(),
    }
  },
  prompts () {
    const { outFolder } = this
    return [
      /* Project Information */
      {
        name: 'name',
        message: 'Project Name',
        default: outFolder,
        filter: val => val.toLowerCase()
      },
      {
        name: 'description',
        message: 'Project Description'
      },
      {
        name: 'version',
        message: 'Project Version',
        default: '0.1.0'
      },
      {
        name: 'license',
        message: 'Project License',
        type: 'list',
        choices: [
          {
            name: 'None',
            value: 'none'
          },
          {
            name: 'MIT License',
            value: 'MIT'
          },
          {
            name: 'The Unlicense',
            value: 'UNLICENCED'
          }
        ]
      },
      /* Nuxt.JS */
      {
        name: 'language',
        message: 'Nuxt.JS Development Language',
        default: 'js',
        type: 'list',
        choices: [
          {
            name: 'Javascript',
            value: 'js'
          },
          {
            name: 'Typescript',
            value: 'ts'
          }
        ]
      },
      {
        name: 'srcDir',
        message: 'Nuxt.js Source Folder',
        default: 'src'
      },
      {
        name: 'mode',
        message: 'Nuxt.js Rendering Mode',
        type: 'list',
        default: 'universal',
        choices: [
          {
            name: 'Universal Application',
            value: 'universal'
          },
          {
            name: 'Single Page Application',
            value: 'spa'
          }
        ]
      },
      {
        name: 'nuxtModules',
        message: 'Nuxt.js Modules',
        type: 'checkbox',
        choices: [
          {
            name: 'Localization (nuxt-i18n)',
            value: 'nuxt-i18n'
          }
        ]
      }
    ]
  },
  actions () {
    const { license, language, srcDir, nuxtModules = [] } = this.answers
    const pkgName = (language === 'ts') ? 'nuxt-ts' : 'nuxt'

    return [
      /* Project Information */
      {
        /* common file */
        type: 'add',
        templateDir: 'template/common',
        files: '**'
      },
      {
        type: 'add',
        templateDir: 'template/license',
        files: `LICENSE-${license}`
      },
      {
        type: 'move',
        patterns: {
          'LICENSE-*': 'LICENSE'
        }
      },
      /* package.json */
      {
        type: 'modify',
        files: 'package.json',
        handler (pkg) {
          /* add script */
          pkg.scripts = {
            build: `npx ${pkgName} build`,
            start: `npx ${pkgName} start`,
            dev: `npx ${pkgName}`
          }

          /* add dependency */
          for (const [depName, depVersion] of Object.entries(dependencies[language])) {
            if (depName === 'dev') {
              for (const [devName, devVersion] of Object.entries(dependencies[language].dev)) {
                pkg.devDependencies[devName] = devVersion
              }
            } else {
              pkg.dependencies[depName] = depVersion
            }
          }

          /* add module dependency */
          for (const module of nuxtModules) {
            pkg.dependencies[module] = modules[module]
          }

          return pkg
        }
      },
      /* Nuxt.js */
      {
        type: 'add',
        templateDir: 'template/nuxt/src',
        files: '**'
      },
      {
        type: 'modify',
        files: 'nuxt.config',
        handler(conf) {
          let prefix = 'module.exports = '
          if (language === 'ts') {
            prefix = "export default "
          }

          return prefix + conf
        }
      },
      {
        type: 'move',
        patterns: {
          'nuxt.config': `nuxt.config.${language}`
        }
      },
      nuxtModules.includes('nuxt-i18n') && {
        type: 'add',
        templateDir: 'template/nuxt/modules/i18n',
        files: '**'
      },
      nuxtModules.includes('nuxt-i18n') &&
      language === 'ts' && {
        type: 'move',
        patterns: {
          'en-US.js': 'en-US.ts'
        }
      },
      {
        type: 'move',
        patterns: {
          /* assets */
          'assets': `${srcDir}/assets`,

          /* layout */
          'layouts': `${srcDir}/layouts`,

          /* page */
          'pages': `${srcDir}/pages`,
        }
      },
      {
        type: 'add',
        templateDir: `template/nuxt/${language}`,
        files: '**'
      },
      /* 이름 변경 */
      {
        type: 'move',
        patterns: {
          gitignore: '.gitignore',
          prettierrc: '.prettierrc',

          // js //
          eslintrc: '.eslintrc',
          babelrc: '.babelrc'
        }
      }
    ]
  },
  async completed() {
    this.gitInit()
    this.showProjectTips()
  }
}
