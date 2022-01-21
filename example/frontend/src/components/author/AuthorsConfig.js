import { Author } from '@/models'
import { RouteConfig } from '@a-admin/routes/RouteConfig'

import AuthorDetail from './AuthorDetail'
import AuthorForm from './AuthorForm'
import AuthorsList from './AuthorsList'

export class AuthorsConfig extends RouteConfig {
  model = {
    action: this.api.getAction('Example.AuthorResource', 'get_author'),

    fields: {
      name: true,
      tags: {
        name: true,
        count_users: true
      },
      count_articles: true
    }
  }

  list = {
    Model: Author,

    Component: AuthorsList,

    action: this.api.getAction('Example.AuthorResource', 'get_authors'),

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
    Component: AuthorDetail
  }

  edit = {
    Component: AuthorForm,

    action: this.api.getAction('Example.AuthorResource', 'save_author'),

    fields: {
      name: true
    }
  }

  new = {
    Model: Author,

    Component: AuthorForm,

    action: this.api.getAction('Example.AuthorResource', 'save_author'),

    fields: {
      name: true
    }
  }
}
