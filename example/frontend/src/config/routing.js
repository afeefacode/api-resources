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
              name: 'authors',
              idKey: 'authorId',
              config: {
                route: new AuthorsRouteConfig(api)
              }
            }),

            ROUTESET({
              path: 'artikel',
              name: 'articles',
              idKey: 'articleId',
              config: {
                route: new ArticlesRouteConfig(api)
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
