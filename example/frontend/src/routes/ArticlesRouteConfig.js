import ArticleCard from '@/components/models/article/ArticleCard'
import ArticleDetail from '@/components/models/article/ArticleDetail'
import ArticleForm from '@/components/models/article/ArticleForm'
import ArticlesFilters from '@/components/models/article/ArticlesFilters'
import { Article } from '@/models'

import { RouteConfig } from './RouteConfig'

export class ArticlesRouteConfig extends RouteConfig {
  Model = Article

  list = {
    Filters: ArticlesFilters,
    Card: ArticleCard,

    action: this.api.getAction('Example.ArticlesResource', 'get_articles'),

    fields: {
      title: true,
      date: true,
      author: {
        name: true
      },
      tags: {
        name: true,
        count_users: true
      },
      count_comments: true
    }
  }

  model = {
    action: this.api.getAction('Example.ArticlesResource', 'get_article'),

    fields: {
      title: true,
      date: true,
      summary: true,
      content: true,
      author: {
        name: true
      },
      tags: {
        name: true,
        count_users: true
      },
      count_comments: true
    }
  }

  detail = {
    Detail: ArticleDetail
  }

  create = {
    Form: ArticleForm
  }

  edit = {
    Form: ArticleForm
  }
}
