<template>
  <div>
    <detail-meta>
      Artikel #{{ article.id }}
      |
      von
      <router-link :to="article.author.getLink()">
        {{ article.author.name }}
      </router-link>
      |
      am {{ date }}
      |
      {{ article.count_comments }} Kommentare
    </detail-meta>

    <detail-title>
      {{ article.title }}
    </detail-title>

    <tag-list :model="article" />

    <p class="summary">
      {{ article.summary }}
    </p>

    <p>
      {{ article.content }}
    </p>
  </div>
</template>


<script>
import { Article } from '@/models'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model']
})
export default class ArticleDetail extends Vue {
  static getDetailConfig (route) {
    return {
      action: Article.getAction(route.meta.routeDefinition, 'get_article'),

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
  }

  get article () {
    return this.model
  }

  get date () {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return this.article.date.toLocaleDateString('de-DE', options)
  }
}
</script>
