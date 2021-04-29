import ArticleCard from '@/components/models/article/ArticleCard'

import { Model } from './Model'

export class Article extends Model {
  static type = 'Example.ArticleType'

  $components = {
    listCard: ArticleCard
  }

  getRoute (action) {
    return {
      name: 'articles.' + action,
      params: {
        articleId: this.id
      }
    }
  }
}
