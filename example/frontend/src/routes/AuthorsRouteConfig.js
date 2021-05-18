import AuthorCard from '@/components/models/author/AuthorCard'
import AuthorDetail from '@/components/models/author/AuthorDetail'
import AuthorForm from '@/components/models/author/AuthorForm'
import { Author } from '@/models'

import { RouteConfig } from './RouteConfig'

export class AuthorsRouteConfig extends RouteConfig {
  Model = Author

  list = {
    Card: AuthorCard,

    action: this.api.getAction('Example.AuthorsResource', 'get_authors'),

    fields: {
      name: true,
      tags: {
        name: true,
        count_users: true
      },
      count_articles: true
    }
  }

  model = {
    action: this.api.getAction('Example.AuthorsResource', 'get_author'),

    fields: {
      name: true,
      tags: {
        name: true,
        count_users: true
      },
      count_articles: true
    }
  }

  detail = {
    Detail: AuthorDetail
  }

  create = {
    Form: AuthorForm
  }

  edit = {
    Form: AuthorForm
  }
}
