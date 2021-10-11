<template>
  <list-view
    v-bind="$attrs"
    :action="action"
    :fields="fields"
    :filters.sync="filters"
  >
    <template #filters>
      <list-filter-row>
        <list-filter-search />

        <list-filter-select
          name="author_id"
          label="Autor"
          maxWidth="200"
        />

        <list-filter-select
          name="tag_id"
          label="Tag"
          maxWidth="200"
        />

        <list-filter-select
          name="has_comments"
          label="Mit Kommentar"
          maxWidth="100"
        />
      </list-filter-row>

      <list-filter-page />
    </template>

    <template #header>
      <div>Name</div>
      <div>Datum</div>
      <div>Kommentare</div>
    </template>

    <template #model="{ model: article }">
      <list-card>
        <list-meta>
          Artikel #{{ article.id }}
          |
          von
          <router-link
            v-if="article.author"
            :to="article.author.getLink()"
          >
            {{ article.author.name }}
          </router-link>
          |
          <template v-if="article.date">
            am {{ date(article) }}
            |
          </template>
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
import { Article } from '@/models'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['authorId']
})
export default class ArticlesList extends Vue {
  static getListConfig (route) {
    return {
      action: Article.getAction(route.meta.routeDefinition, 'get_articles'),

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

  filters = []

  created () {
    // this.filters.author_id.value = this.authorId
    console.log(this.authorId, this.filters)
  }

  get action () {
    return ArticlesList.getListConfig(this.$route).action
  }

  get fields () {
    return ArticlesList.getListConfig(this.$route).fields
  }

  clickTag (tag) {
    this.filters.tag_id.value = tag.id
    console.log(this.authorId, this.filters)
  }

  date (article) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return article.date.toLocaleDateString('de-DE', options)
  }
}
</script>
