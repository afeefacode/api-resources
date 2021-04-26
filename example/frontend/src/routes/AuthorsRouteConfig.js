import { Author } from '@/models'

import { RouteConfig } from './RouteConfig'

export class AuthorsRouteConfig extends RouteConfig {
  resourceName = 'Example.AuthorsResource'
  actionName = 'get_authors'

  Model = Author

  listFields = {
    name: true,
    tags: {
      name: true,
      count_users: true
    },
    count_articles: true
  }
}
