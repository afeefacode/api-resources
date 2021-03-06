import { ArticlesConfig } from '@/components/article/ArticlesConfig'
import { AuthorsConfig } from '@/components/author/AuthorsConfig'
import Menu from '@/components/Menu'
import App from '@a-admin/components/App'
import { apiResources } from '@afeefa/api-resources-client'

export default function (routeConfigPlugin) {
  return routeConfigPlugin
    .router({
      base: process.env.BASE_URL
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
            props: {
              Menu
            },
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
                  routing: new AuthorsConfig(api)
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
                  routing: new ArticlesConfig(api)
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
}
