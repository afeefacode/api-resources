import App from '@/App'
import Detail from '@/components/routes/Detail'
import Edit from '@/components/routes/Edit'
import List from '@/components/routes/List'
import New from '@/components/routes/New'
import { ArticlesResource } from '@/resources/ArticlesResource'
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
            name: 'authors2.list'
          },
          config: {
            title: 'Frontend'
          },

          children: [
            ROUTE({
              path: 'autoren2',
              name: 'authors2.list',
              component: List,

              children: [
                ROUTE({
                  path: 'artikel2',
                  name: 'articles2.list',
                  component: List
                })
              ]
            }),

            ROUTE({
              path: 'artikel2',
              name: 'articles2.list',
              component: List,

              children: [
                ROUTESET({
                  path: 'autoren3',
                  name: 'authors3',
                  idKey: 'authorId'
                })
              ]
            }),

            ROUTESET({
              path: 'autoren',
              name: 'authors',
              idKey: 'authorId',
              config: {
                title: 'Autoren',
                action: 'Example.AuthorsResource::get_authors'
              },

              children: [
                ROUTESET({
                  path: 'kommentare',
                  name: 'comments',
                  idKey: 'commentId'
                })
              ]
            }),

            ROUTESET({
              path: 'artikel',
              name: 'articles',
              idKey: 'articleId',
              config: {
                action: api.getAction('Example.ArticlesResource', 'get_articles'),
                Resource: ArticlesResource,
                title: 'Artikel'
              }
            })
          ]

        }
      )
    ]
  })
