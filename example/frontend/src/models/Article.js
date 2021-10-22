import { Model } from '@a-admin/models/Model'
import { mdiFileDocumentOutline } from '@mdi/js'

export class Article extends Model {
  static type = 'Example.Article'

  static resourceType = 'Example.ArticleResource'

  static routeName = 'articles'

  static routeIdKey = 'articleId'

  static icon = {
    icon: mdiFileDocumentOutline,
    color: 'yellow darken-3'
  }

  getTitle () {
    return this.title
  }
}
