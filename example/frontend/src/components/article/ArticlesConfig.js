import { Article } from '@/models'
import { RouteConfig } from '@a-admin/routes/RouteConfig'

import ArticleCreateForm from './ArticleCreateForm'
import ArticleDetail from './ArticleDetail'
import ArticleForm from './ArticleForm'
import ArticlesList from './ArticlesList'

export class ArticlesConfig extends RouteConfig {
  model = {
    action: this.api.getAction('Example.ArticleResource', 'get_article'),

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

    action: this.api.getAction('Example.ArticleResource', 'get_articles'),

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

    action: this.api.getAction('Example.ArticleResource', 'update_article'),

    fields: {
      title: true,
      summary: true,
      content: true
    }
  }

  new = {
    Model: Article,

    Component: ArticleCreateForm,

    action: this.api.getAction('Example.ArticleResource', 'create_article'),

    fields: {
      author: true,
      title: true
    }
  }
}
