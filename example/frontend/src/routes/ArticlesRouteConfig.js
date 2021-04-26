import { Article } from '@/models'

import { RouteConfig } from './RouteConfig'

export class ArticlesRouteConfig extends RouteConfig {
  resourceName = 'Example.ArticlesResource'
  actionName = 'get_articles'

  Model = Article

  listFields = {
    title: true,
    date: true,
    author: {
      name: true
    },
    tags: {
      name: true,
      count_users: true
    },
    count_comments: true
  }
}
