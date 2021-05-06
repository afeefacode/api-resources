import { ArticlesRouteConfig } from '@/routes/ArticlesRouteConfig'

import { Model } from './Model'

export class Article extends Model {
  static type = 'Example.ArticleType'
  static RouteConfig = ArticlesRouteConfig

  getTitle () {
    return this.title
  }
}
