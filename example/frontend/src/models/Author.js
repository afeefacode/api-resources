import { Model } from '@a-admin/models/Model'
import { mdiAccount } from '@mdi/js'

export class Author extends Model {
  static type = 'Example.Author'

  static routeName = 'authors'

  static routeIdKey = 'authorId'

  static icon = {
    icon: mdiAccount,
    color: 'yellow darken-3'
  }

  getTitle () {
    return this.name
  }
}
