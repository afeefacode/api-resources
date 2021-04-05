import { RouteConfigPlugin } from '@avue/plugins/route-config/RouteConfigPlugin'
import Vue from 'vue'
import Router from 'vue-router'

import { routes } from './routes'

Vue.use(RouteConfigPlugin)
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
