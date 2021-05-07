import { Model } from './Model'

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
