import './config/components'
import './config/event-bus'

import { timeout } from '@avue/utils/timeout'
import Vue from 'vue'

import Splash from './components/Splash'
import apiResources from './config/api'
import routing from './config/routing'
import vuetify from './config/vuetify'

Vue.config.productionTip = false

const splash = new Vue({
  vuetify,
  el: '#app',
  components: {
    Splash
  },
  template: '<splash />'
})

async function bootstrap () {
  const router = await routing.getRouter()
  await apiResources.schemasLoaded()

  timeout(() => {
    splash.$destroy()

    new Vue({
      vuetify,
      router,
      el: '#app',
      template: '<router-view></router-view>'
    })
  }, 500)
}

bootstrap()
