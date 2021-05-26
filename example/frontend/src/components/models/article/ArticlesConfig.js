import ArticleDetail from '@/components/models/article/ArticleDetail'
import ArticleForm from '@/components/models/article/ArticleForm'
import ArticlesList from '@/components/models/article/ArticlesList'
import { Article } from '@/models'
import { RouteConfig } from '@/routes/RouteConfig'

export class ArticlesConfig extends RouteConfig {
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

  list = {
    Model: Article,

    Component: ArticlesList,

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

  detail = {
    Component: ArticleDetail
  }

  edit = {
    Component: ArticleForm,

    action: this.api.getAction('Example.ArticlesResource', 'update_article'),

    fields: {
      title: true,
      summary: true,
      content: true
    }
  }

  new = {
    Model: Article,

    Component: ArticleForm,

    action: this.api.getAction('Example.ArticlesResource', 'create_article'),

    fields: {
      title: true,
      summary: true,
      content: true
    }
  }
}
