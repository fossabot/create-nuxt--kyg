const dependencies_list = {
  "@nuxtjs/axios": "^5.3.6",
  "@nuxtjs/pwa": "^2.6.0",
  "nuxt-i18n": "^5.8.0",
  "sass": "^1.16.1",
  "sass-loader": "^7.1.0"
};


module.exports = {
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
            value: 'mit'
          },
          {
            name: 'Unlicense',
            value: 'UNLICENSED'
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
        default: '.',
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
    const that = this.answers

    return [
      {
        type: 'add',
        files: './**'
      },
      {
        type: 'move',
        patterns: {
          gitignore: '.gitignore',
          editorconfig: '.editorconfig',
          eslintrc: '.eslintrc',
          prettierrc: '.prettierrc',
        }
      },
      {
        type: 'modify',
        files: 'package.json',
        handler(pkg) {

          for (module of that.module) {
            pkg.dependencies[module] = dependencies_list[module]
          }

          if (that.stylesheet !== 'css') {
            for (stylesheet of that.stylesheet) {
              pkg.devDependencies[stylesheet] = dependencies_list[stylesheet]
            }
          }

          return pkg
        }
      }
    ]
  },
  async completed() {
    this.gitInit()
    await this.npmInstall()
    this.showProjectTips()
  }
}
