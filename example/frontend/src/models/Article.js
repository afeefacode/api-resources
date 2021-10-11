import { Model } from '@a-admin/models/Model'

export class Article extends Model {
  static type = 'Example.ArticleType'

  static resourceType = 'Example.ArticleResource'

  static routeName = 'articles'

  static routeIdKey = 'articleId'

  getTitle () {
    return this.title
  }
}
