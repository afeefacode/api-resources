import './main.scss'
import './config/components'

import * as models from '@/models'
import { AfeefaAdmin } from '@a-admin/AfeefaAdmin'

import SidebarMenu from './components/SidebarMenu'
import Splash from './components/Splash'
import { breadcrumbs } from './config/breadcrumbs'
import { routes } from './config/routes'
import routing from './config/routing'

new AfeefaAdmin()

  .app({
    logo: '/frontend/logo.svg',
    title: 'Example',
    loaderColor: '#82b81c',
    rootRouteName: 'articles.list',
    components: {
      Splash,
      SidebarMenu
    }
  })

  .api({
    models: Object.values(models),
    apis: {
      'Example.BackendApi': '/backend-api'
    }
  })

  .routing(routeConfigPlugin => {
    routeConfigPlugin
      .scrollContainer('#v-main')
      .routes(routes)
      .breadcrumbs(breadcrumbs)
  })
