import ArticleCard from '@/components/models/article/ArticleCard'
import ArticleDetail from '@/components/models/article/ArticleDetail'
import ArticleForm from '@/components/models/article/ArticleForm'
import { Article } from '@/models'

import { RouteConfig } from './RouteConfig'

export class ArticlesRouteConfig extends RouteConfig {
  resourceName = 'Example.ArticlesResource'
  listActionName = 'get_articles'
  getActionName = 'get_article'

  Model = Article

  components = {
    listCard: ArticleCard,
    detail: ArticleDetail,
    form: ArticleForm
  }

  breadcrumbNames = {
    list: 'Artikel',
    model: 'Artikel'
  }

  listFields = {
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

  getFields = {
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
