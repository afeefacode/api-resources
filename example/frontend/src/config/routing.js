import App from '@/components/App'
import ArticleContainer from '@/components/models/article/ArticleContainer'
import ArticleDetail from '@/components/models/article/ArticleDetail'
import ArticleForm from '@/components/models/article/ArticleForm'
import ArticlesList from '@/components/models/article/ArticlesList'
import AuthorContainer from '@/components/models/author/AuthorContainer'
import AuthorDetail from '@/components/models/author/AuthorDetail'
import AuthorForm from '@/components/models/author/AuthorForm'
import AuthorsList from '@/components/models/author/AuthorsList'
import CreateRoute from '@/components/routes/CreateRoute'
import DetailRoute from '@/components/routes/DetailRoute'
import EditRoute from '@/components/routes/EditRoute'
import ListRoute from '@/components/routes/ListRoute'
import ModelRoute from '@/components/routes/ModelRoute'
import { Article, Author } from '@/models'
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
                Model: Author,
                components: {
                  list: AuthorsList,
                  model: AuthorContainer,
                  detail: AuthorDetail,
                  new: AuthorForm,
                  edit: AuthorForm
                }
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
                Model: Article,
                components: {
                  list: [ArticlesList, {filterSource: 'route'}],
                  model: ArticleContainer,
                  detail: ArticleDetail,
                  new: ArticleForm,
                  edit: ArticleForm
                }
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
