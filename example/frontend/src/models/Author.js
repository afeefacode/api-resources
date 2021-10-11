import { Model } from '@a-admin/models/Model'

export class Author extends Model {
  static type = 'Example.AuthorType'

  static resourceType = 'Example.AuthorResource'

  static routeName = 'authors'

  static routeIdKey = 'authorId'

  getTitle () {
    return this.name
  }
}
