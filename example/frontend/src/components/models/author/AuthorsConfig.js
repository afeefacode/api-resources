import AuthorDetail from '@/components/models/author/AuthorDetail'
import AuthorForm from '@/components/models/author/AuthorForm'
import AuthorsList from '@/components/models/author/AuthorsList'
import { Author } from '@/models'
import { RouteConfig } from '@/routes/RouteConfig'

export class AuthorsConfig extends RouteConfig {
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

  list = {
    Model: Author,

    Component: AuthorsList,

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

  detail = {
    Component: AuthorDetail
  }

  edit = {
    Component: AuthorForm,

    action: this.api.getAction('Example.AuthorsResource', 'update_author'),

    fields: {
      name: true
    }
  }

  new = {
    Model: Author,

    Component: AuthorForm,

    action: this.api.getAction('Example.AuthorsResource', 'create_author'),

    fields: {
      name: true
    }
  }
}
