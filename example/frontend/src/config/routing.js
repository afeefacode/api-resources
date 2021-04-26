import App from '@/components/App'
import Detail from '@/components/routes/Detail'
import Edit from '@/components/routes/Edit'
import List from '@/components/routes/List'
import New from '@/components/routes/New'
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
    list: List,
    detail: Detail,
    edit: Edit,
    new: New
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
