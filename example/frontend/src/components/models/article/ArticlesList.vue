<template>
  <list-view
    :config="config"
    :filters.sync="filters"
    :count.sync="count"
  >
    <template #filters>
      <v-row>
        <v-col cols="3">
          <list-filter name="author_id" />
        </v-col>

        <v-col cols="3">
          <list-filter name="tag_id" />
        </v-col>

        <v-col cols="3">
          <list-filter name="has_comments" />
        </v-col>

        <v-col cols="3">
          <list-filter name="q" />
        </v-col>

        <v-col cols="3">
          <list-filter name="page_size" />
        </v-col>

        <v-col cols="3">
          <list-filter name="order" />
        </v-col>
      </v-row>

      <v-row>
        <list-filter
          name="page"
          :count="count"
          :page_size="filters.page_size.value"
        />
      </v-row>
    </template>

    <template #model="{ model: article }">
      <list-card>
        <list-meta>
          Artikel #{{ article.id }}
          |
          von
          <router-link :to="article.author.getLink()">
            {{ article.author.name }}
          </router-link>
          |
          am {{ date(article) }}
          |
          {{ article.count_comments }} Kommentare
        </list-meta>

        <list-title :link="article.getLink()">
          {{ article.title }}
        </list-title>

        <tag-list
          :model="article"
          @clickTag="clickTag"
        />
      </list-card>
    </template>
  </list-view>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'
import { apiResources } from '@afeefa/api-resources-client'
import { Article } from '@/models'
import ArticleCard from '@/components/models/article/ArticleCard'
import ArticlesFilters from '@/components/models/article/ArticlesFilters'

@Component({
  components: {
    ArticlesFilters,
    ArticleCard
  }
})
export default class ArticlesList extends Vue {
  filters = []
  count = 0

  get config () {
    const api = apiResources.getApi('backendApi')

    return {
      listId: 'articles',

      Model: Article,

      components: {
        Filters: ArticlesFilters,
        Card: ArticleCard
      },

      filterSource: 'object',

      action: api.getAction('Example.ArticlesResource', 'get_articles'),

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
  }

  clickTag (tag) {
    console.log('filters', this.filters, this.count)
    this.filters.tag_id.value = tag.id
  }

  date (article) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return article.date.toLocaleDateString('de-DE', options)
  }
}
</script>
