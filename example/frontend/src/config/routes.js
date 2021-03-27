import App from '@/App'
import Detail from '@/components/routes/Detail'
import Edit from '@/components/routes/Edit'
import List from '@/components/routes/List'
import New from '@/components/routes/New'
import { RouteDefinitionsPlugin } from '@avue/routes/RouteDefinitionsPlugin'

const defintions = new RouteDefinitionsPlugin()

defintions
  .defaultComponents({
    list: List,
    detail: Detail,
    edit: Edit,
    new: New
  })

  .routes(({SINGLE, SET}) => {
    return [
      SINGLE(
        {
          path: '/',
          component: App,

          children: [
            SINGLE({
              path: '/autoren2',
              name: 'authors2.list',
              component: List
            }),

            SINGLE({
              path: '/artikel2',
              name: 'articles2.list',
              component: List,

              children: [
                SET({
                  path: 'autoren',
                  name: 'authors',
                  idKey: 'authorId'
                })
              ]
            }),

            SET({
              path: 'autoren',
              name: 'authors',
              idKey: 'authorId'
            }),

            SET({
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
