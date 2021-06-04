import { Model } from '@a-admin/models/Model'

export class Article extends Model {
  static type = 'Example.ArticleType'

  getLink (action = 'detail') {
    return {
      name: `articles.${action}`,
      params: {
        articleId: this.id
      }
    }
  }

  getTitle () {
    return this.title
  }
}
