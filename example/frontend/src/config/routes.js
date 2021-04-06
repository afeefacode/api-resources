import App from '@/App'
import Detail from '@/components/routes/Detail'
import Edit from '@/components/routes/Edit'
import List from '@/components/routes/List'
import New from '@/components/routes/New'
import { RouteConfigPlugin } from '@avue/plugins/route-config/RouteConfigPlugin'

const config = new RouteConfigPlugin()

config
  .defaultComponents({
    list: List,
    detail: Detail,
    edit: Edit,
    new: New
  })

  .routes(({ROUTE, ROUTESET}) => {
    return [
      ROUTE(
        {
          path: '/',
          name: 'root',
          component: App,

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
              idKey: 'articleId'
            })
          ]

        }
      )
    ]
  })

config.dumpRoutes()

export const routes = config.getRoutes()
