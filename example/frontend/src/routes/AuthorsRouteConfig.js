import AuthorCard from '@/components/models/author/AuthorCard'
import AuthorDetail from '@/components/models/author/AuthorDetail'
import AuthorForm from '@/components/models/author/AuthorForm'
import { Author } from '@/models'

import { RouteConfig } from './RouteConfig'

export class AuthorsRouteConfig extends RouteConfig {
  resourceName = 'Example.AuthorsResource'
  listActionName = 'get_authors'
  getActionName = 'get_author'

  Model = Author

  components = {
    listCard: AuthorCard,
    detail: AuthorDetail,
    form: AuthorForm
  }

  breadcrumbNames = {
    list: 'Autoren',
    model: 'Autor'
  }

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
