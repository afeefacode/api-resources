import App from '@/components/App'
import DetailRoute from '@/components/routes/DetailRoute'
import EditRoute from '@/components/routes/EditRoute'
import ListRoute from '@/components/routes/ListRoute'
import ModelRoute from '@/components/routes/ModelRoute'
import NewRoute from '@/components/routes/NewRoute'
import { ArticlesRouteConfig } from '@/routes/ArticlesRouteConfig'
import { AuthorsRouteConfig } from '@/routes/AuthorsRouteConfig'
import { apiResources } from '@afeefa/api-resources-client'
import { routeConfigPlugin } from '@avue/plugins/route-config/RouteConfigPlugin'

export default routeConfigPlugin
  .router({
    mode: 'history',
    base: process.env.BASE_URL
  })

  .defaultComponents({
    list: ListRoute,
    model: ModelRoute,
    detail: DetailRoute,
    edit: EditRoute,
    new: NewRoute
  })

  .config({
    api: apiResources.getApi('backendApi')
  })

  .routes(async ({ROUTE, ROUTESET}) => {
    await apiResources.schemasLoaded()
    const api = apiResources.getApi('backendApi')

    const authorsConfig = new AuthorsRouteConfig(api)
    const articlesConfig = new ArticlesRouteConfig(api)

    return [
      ROUTE(
        {
          path: '/',
          name: 'root',
          component: App,
          redirect: {
            name: 'articles.list'
          },

          children: [
            ROUTESET({
              path: 'autoren',
              name: authorsConfig.routeName,
              idKey: authorsConfig.idKey,
              config: {
                route: authorsConfig
              }
            }),

            ROUTESET({
              path: 'artikel',
              name: articlesConfig.routeName,
              idKey: articlesConfig.idKey,
              config: {
                route: articlesConfig
              },

              children: [
                ROUTESET({
                  path: 'kommentare',
                  name: 'comments',
                  idKey: 'commentId'
                })
              ]
            })
          ]

        }
      )
    ]
  })
