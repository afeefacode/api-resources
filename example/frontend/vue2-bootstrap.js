const appConfig = require('@afeefa/vue2-bootstrap/vue2-bootstrap.js')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  ...appConfig,

  plugins: [
    new VuetifyLoaderPlugin()
  ],

  publicPath: '/frontend/',

  sockPath: '/frontend/sockjs-node',

  transpileDependencies: [
    'vuetify'
  ]
}
