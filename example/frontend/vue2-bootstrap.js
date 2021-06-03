const path = require('path')
const appConfig = require('@afeefa/vue2-bootstrap/vue2-bootstrap.js')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  ...appConfig,

  publicPath: process.env.NODE_ENV === 'production'
    ? '/frontend-production/'
    : '/frontend/',

  sockPath: '/frontend/sockjs-node',

  plugins: [
    new VuetifyLoaderPlugin({
      match (originalTag, { kebabTag, camelTag, path, component }) {
        if (kebabTag.startsWith('a-')) {
          return [camelTag, `import ${camelTag} from '@a-vue/components/${camelTag}'`]
        }
      }
    })
  ],

  aliases: {
    '@a-vue': path.resolve(__dirname, 'node_modules/@afeefa/vue-app/src'),
    '@a-admin': path.resolve(__dirname, 'node_modules/@afeefa/vue-app/src-admin')
  },

  transpileDependencies: [
    'vuetify',
    '@afeefa/vue-app'
  ]
}
