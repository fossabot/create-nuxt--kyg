'use strict'

const depVersion = {
  nuxt: '^2.4.0',
  typescript: '^3.3.1',
  js: {
    dev: {
      '@babel/core': '^7.2.2',
      '@nuxt/babel-preset-app': '^2.3.4',
      '@nuxtjs/eslint-config': '^0.0.1',
      'babel-eslint': '^10.0.1',
      'eslint': '^5.12.1',
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
    dev: {
      'tslint': '^5.12.1',
      'tslint-config-prettier': '^1.18.0',
      'tslint-config-standard': '^8.0.1'
    }
  }
}

module.exports = {
  templateData () {
    return {
      year: new Date().getFullYear(),
      username: this.gitUser.name
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
      }
    ]
  },
  actions () {
    const { license, language, srcDir } = this.answers

    return [
      /* == Project Information == */

      /* 공통 파일 추가 */
      {
        type: 'add',
        templateDir: 'template/common',
        files: '**'
      },
      /* 라이선스 파일 추가 */
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
      /* == Nuxt.JS == */
      {
        type: 'add',
        templateDir: 'template/nuxt/src',
        files: '**'
      },
      (srcDir !== '.') && {
        type: 'move',
        patterns: {
          /* layout */
          'layouts': `${srcDir}/layouts`,

          /* page */
          'pages': `${srcDir}/pages`
        }
      },
      /* package dependency */
      {
        type: 'modify',
        files: 'package.json',
        handler (pkg) {
          let pkgName = 'nuxt'
          const dependencies = {}
          const devDependencies = {}

          /* Nuxt.js package */
          if (language === 'ts') {
            pkgName += '-ts'
            dependencies.typescript = depVersion.typescript
          }

          /* Add Dev Dependency */
          for (let dep in depVersion[language].dev) {
            devDependencies[dep] = depVersion[language].dev[dep]
          }

          /* Add Test Script */
          pkg.scripts.build = `npx ${pkgName} build`
          pkg.scripts.start = `npx ${pkgName} start`
          pkg.scripts.dev = `npx ${pkgName}`

          dependencies[pkgName] = depVersion.nuxt
          pkg.dependencies = Object.assign({}, pkg.dependencies, dependencies)
          pkg.devDependencies = Object.assign({}, pkg.devDependencies, devDependencies)

          return pkg
        }
      },
      {
        type: 'add',
        templateDir: `template/nuxt/${language}`,
        files: '**'
      },
      /* nuxt.js config */
      {
        type: 'add',
        templateDir: 'template/nuxt',
        files: 'nuxt.config.json'
      },
      {
        type: 'move',
        patterns: {
          'nuxt.config.json': `nuxt.config.${language}`
        }
      },
      {
        type: 'modify',
        files: `nuxt.config.${language}`,
        handler (conf) {
          let returnConf = "'use strict'\n\n"

          if (language === 'ts') {
            returnConf += `export default ${conf}`
          } else {
            returnConf += `module.exports = ${conf}`
          }

          return returnConf
        }
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
  async completed () {
    this.gitInit()
    this.showProjectTips()
  }
}
