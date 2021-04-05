import App from '@/App'
import Detail from '@/components/routes/Detail'
import Edit from '@/components/routes/Edit'
import List from '@/components/routes/List'
import New from '@/components/routes/New'
import { RouteConfigPlugin } from '@avue/plugins/route-config/RouteConfigPlugin'

const defintions = new RouteConfigPlugin()

defintions
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
          component: App,

          children: [
            ROUTE({
              path: '/autoren2',
              name: 'authors2.list',
              component: List
            }),

            ROUTE({
              path: '/artikel2',
              name: 'articles2.list',
              component: List,

              children: [
                ROUTESET({
                  path: 'autoren',
                  name: 'authors',
                  idKey: 'authorId'
                })
              ]
            }),

            ROUTESET({
              path: 'autoren',
              name: 'authors',
              idKey: 'authorId'
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

export const routes = defintions.getRoutes()
