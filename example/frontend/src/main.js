import './config/api'

import Vue from 'vue'

import router from './config/router'
import vuetify from './config/vuetify'

Vue.config.productionTip = false
new Vue({
  vuetify,
  router,

  el: '#app',
  template: '<router-view></router-view>'
})
