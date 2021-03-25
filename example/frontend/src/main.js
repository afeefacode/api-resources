import App from '@/App'
import Vue from 'vue'

import vuetify from './vuetify'

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
