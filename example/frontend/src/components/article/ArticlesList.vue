<template>
  <list-page
    v-bind="$attrs"
    :table="true"
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
      </list-filter-row>

      <list-filter-page />
    </template>

    <template #header>
      <list-column-header
        text="ID"
        order="id"
      />

      <list-column-header
        text="Title"
        order="title"
      />

      <list-column-header
        text="Autor"
        order="author_name"
      />

      <list-column-header
        text="Kommentare"
        order="count_comments"
      />

      <list-column-header
        text="Datum"
        order="date"
      />

      <div>Tags</div>
    </template>

    <template #model="{ model: article }">
      <div>{{ article.id }}</div>

      <div>{{ article.title }}</div>

      <div>
        <router-link :to="article.author.getLink()">
          {{ article.author.name }}
        </router-link>
      </div>

      <div class="info">
        {{ article.count_comments }}
      </div>

      <div class="info">
        {{ date(article) }}
      </div>

      <div>
        <tag-list
          :model="article"
          @clickTag="clickTag"
        />
      </div>
    </template>
  </list-page>
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
      ModelClass: Article,

      action: Article.getAction(route.meta.routeDefinition, 'get_articles'),

      initialFilters: {
        author_id: route.params.authorId
      },

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

  get action () {
    return ArticlesList.getListConfig(this.$route).action
  }

  get fields () {
    return ArticlesList.getListConfig(this.$route).fields
  }

  clickTag (tag) {
    this.filters.tag_id.value = tag.id
  }

  date (article) {
    if (!article.date) {
      return ''
    }

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return article.date.toLocaleDateString('de-DE', options)
  }
}
</script>
