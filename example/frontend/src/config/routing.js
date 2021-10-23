import { breadcrumbs } from './breadcrumbs'
import { routes } from './routes'

export default function (routeConfigPlugin) {
  return routeConfigPlugin
    .router({
      base: process.env.BASE_URL
    })
    .routes(routes)
    .breadcrumbs(breadcrumbs)
}
