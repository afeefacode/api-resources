import { AuthorsRouteConfig } from '@/routes/AuthorsRouteConfig'

import { Model } from './Model'

export class Author extends Model {
  static type = 'Example.AuthorType'
  static RouteConfig = AuthorsRouteConfig

  getTitle () {
    return this.name
  }
}
