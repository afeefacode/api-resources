import { apiResources } from '@afeefa/api-resources-client'

import { breadcrumbs } from './breadcrumbs'
import { routes } from './routes'

export default function (routeConfigPlugin) {
  return routeConfigPlugin
    .router({
      base: process.env.BASE_URL
    })
    .config({
      api: apiResources.getApi('Example.BackendApi')
    })
    .routes(routes)
    .breadcrumbs(breadcrumbs)
}
