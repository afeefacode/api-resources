import { Author } from '@/models'

import { RouteConfig } from './RouteConfig'

export class AuthorsRouteConfig extends RouteConfig {
  resourceName = 'Example.AuthorsResource'

  listActionName = 'get_authors'
  getActionName = 'get_author'

  Model = Author

  listFields = {
    name: true,
    tags: {
      name: true,
      count_users: true
    },
    count_articles: true
  }

  getFields = {
    name: true,
    tags: {
      name: true,
      count_users: true
    },
    count_articles: true
  }
}
