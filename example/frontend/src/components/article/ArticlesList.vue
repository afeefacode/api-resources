<template>
  <list-view
    v-bind="$attrs"
    :filters.sync="filters"
  >
    <template #filters>
      <list-filter-row>
        <v-col cols="3">
          <list-filter name="author_id" />
        </v-col>

        <v-col cols="3">
          <list-filter name="tag_id" />
        </v-col>

        <v-col cols="3">
          <list-filter name="has_comments" />
        </v-col>

        <list-filter-row>
          <list-filter-search />
        </list-filter-row>

        <v-col cols="3">
          <list-filter name="order" />
        </v-col>
      </list-filter-row>

      <list-filter-page />
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

@Component
export default class ArticlesList extends Vue {
  filters = []

  clickTag (tag) {
    this.filters.tag_id.value = tag.id
  }

  date (article) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return article.date.toLocaleDateString('de-DE', options)
  }
}
</script>
