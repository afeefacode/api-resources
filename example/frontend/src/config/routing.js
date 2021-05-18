import App from '@/components/App'
import CreateRoute from '@/components/routes/CreateRoute'
import DetailRoute from '@/components/routes/DetailRoute'
import EditRoute from '@/components/routes/EditRoute'
import ListRoute from '@/components/routes/ListRoute'
import ModelRoute from '@/components/routes/ModelRoute'
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
    new: CreateRoute
  })

  .defaultBreadcrumbTitles({
    edit: 'Bearbeiten',
    new: 'Neu'
  })

  .defaultRoutePaths({
    edit: 'bearbeiten',
    new: 'neu'
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
              breadcrumbTitles: {
                list: 'Autoren',
                detail: 'Autor'
              },
              config: {
                route: new AuthorsRouteConfig(api)
              }
            }),

            ROUTESET({
              path: 'artikel',
              name: 'articles',
              idKey: 'articleId',
              breadcrumbTitles: {
                list: 'Artikel',
                detail: 'Artikel'
              },
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
