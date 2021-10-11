import './config/components'

import * as models from '@/models'
import { bootstrap } from '@a-admin/bootstrap'

import SidebarMenu from './components/SidebarMenu'
import Splash from './components/Splash'
import routing from './config/routing'

bootstrap({
  apis: {
    'Example.BackendApi': '/backend-api'
  },

  models: Object.values(models),

  routing,

  app: {
    logo: '/frontend/logo.svg',
    title: 'Example',
    loaderColor: '#82b81c',
    rootRouteName: 'articles.list'
  },

  components: {
    Splash,
    SidebarMenu
  }
})
