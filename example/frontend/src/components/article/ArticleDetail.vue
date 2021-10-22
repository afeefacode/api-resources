<template>
  <detail-page
    v-bind="$attrs"
    :has="{edit: false}"
    @model="article = $event"
  >
    <template #model="{model: article}">
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
  </detail-page>
</template>


<script>
import { Article } from '@/models'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ArticleDetail extends Vue {
  article = null

  static getDetailConfig (route) {
    return {
      ModelClass: Article,

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

  get date () {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return this.article.date.toLocaleDateString('de-DE', options)
  }
}
</script>
