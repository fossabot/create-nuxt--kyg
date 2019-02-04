const dependencies_list = {
  // dependencies
  "@nuxtjs/axios": "^5.3.6",
  "@nuxtjs/pwa": "^2.6.0",
  "nuxt-i18n": "^5.8.0",

  // dev dependencies
  "sass": "^1.16.1",
  "sass-loader": "^7.1.0"
};


module.exports = {
  templateData () {
    return {
      year: new Date().getFullYear(),
      username: this.gitUser.name
    }
  },
  prompts() {
    return [
      {
        name: 'name',
        message: '프로젝트 이름: ',
        default: this.outFolder,
        filter: val => val.toLowerCase()
      },
      {
        name: 'description',
        message: '프로젝트 설명: ',
        default: 'My Project'
      },
      {
        name: 'version',
        message: '프로젝트 초기 버전: ',
        default: '0.1.0'
      },
      {
        name: 'license',
        message: '라이선스: ',
        type: 'list',
        default: 'mit',
        choices: [
          {
            name: 'None',
            value: ''
          },
          {
            name: 'MIT License',
            value: 'MIT'
          },
          {
            name: 'Unlicense',
            value: 'UNLICENSED'
          }
        ]
      },
      {
        name: 'language',
        message: 'Nuxt.JS 언어',
        type: 'list',
        default: 'js',
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
        name: 'mode',
        message: 'Nuxt.JS 렌더링 모드: ',
        type: 'list',
        default: 'universal',
        choices: [
          {
            name: 'Single Page Application',
            value: 'spa'
          },
          {
            name: 'Universal Application',
            value: 'universal',
          }
        ]
      },
      {
        name: 'srcDir',
        message: 'Nuxt.JS 소스 루트 위치',
        default: 'src',
      },
      {
        name: 'module',
        message: 'Nuxt.JS 모듈 선택',
        type: 'checkbox',
        default: ['@nuxtjs/axios'],
        choices: [
          {
            name: 'HTTP Client',
            value: '@nuxtjs/axios'
          },
          {
            name: '현지화',
            value: 'nuxt-i18n'
          },
          {
            name: 'PWA',
            value: '@nuxtjs/pwa'
          }
        ]
      },
      {
        name: 'stylesheet',
        message: '스타일 시트 선택',
        type: 'list',
        default: 'css',
        choices: [
          {
            name: 'CSS (None)',
            value: 'css'
          },
          {
            name: 'SASS / SCSS (Custom)',
            value: ['sass', 'sass-loader']
          },
        ]
      }
    ]
  },
  actions() {
    const { license, srcDir, module, language, stylesheet } = this.answers

    return [
      {
        type: 'add',
        templateDir: 'template/common',
        files: '**'
      },
      /* 라이선스 선택 */
      {
        type: 'add',
        templateDir: 'template/license',
        files: `LICENSE-${license}`
      },
      /* nuxt 파일 이동 */
      {
        type: 'add',
        templateDir: 'template/nuxt',
        files: '**'
      },
      {
        type: 'modify',
        files: 'nuxt.config.json',
        handler(conf) {

          /* 소스폴더 위치 */
          if (srcDir !== '.') {
            conf.srcDir = srcDir
          }

          /* 모듈 import */
          if ((typeof module) !== 'undefined') {
            conf.module = []
            for (that of module) {
              conf.module.push(that)
            }
          }

          return conf
        }
      },
      {
        type: 'move',
        patterns: {
          'nuxt.config.json': `nuxt.config.${language}`
        }
      },
      {
        type: 'add',
        templateDir: `template/nuxt-${language}`,
        files: '**'
      },
      {
        type: 'modify',
        files: 'package.json',
        handler(pkg) {

          for (that of module) {
            pkg.dependencies[that] = dependencies_list[that]
          }

          if (stylesheet !== 'css') {
            for (that of stylesheet) {
              pkg.devDependencies[that] = dependencies_list[that]
            }
          }

          return pkg
        }
      },
      (srcDir !== '.') && {
        type: 'move',
        patterns: {
          /* layout */
          'layouts': `${srcDir}/layouts`,

          /* page */
          'pages': `${srcDir}/pages`,
        }
      },
      /* 공통 파일 이름변경 */
      {
        type: 'move',
        patterns: {
          gitignore: '.gitignore',
          editorconfig: '.editorconfig',
          eslintrc: '.eslintrc',
          prettierrc: '.prettierrc',
          'LICENSE-*': 'LICENSE'
        }
      },
    ]
  },
  async completed() {
    this.gitInit()
    this.showProjectTips()
  }
}
