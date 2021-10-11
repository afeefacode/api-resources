import * as articles from '@/components/article/articles'
import * as authors from '@/components/author/authors'
import App from '@a-admin/components/App'

export async function routes ({ROUTE, ROUTESET}) {
  return [
    ROUTE(
      {
        path: '/',
        component: App,
        redirect: {
          name: 'articles.list'
        },

        children: [
          ROUTESET({
            path: 'autoren',
            name: 'authors',
            idKey: 'authorId',
            config: authors
          }),

          ROUTESET({
            path: 'artikel',
            name: 'articles',
            idKey: 'articleId',
            config: articles,

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
}
