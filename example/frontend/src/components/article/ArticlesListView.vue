<template>
  <list-view
    v-bind="$attrs"
    :action="action"
    :scopes="scopes"
    :fields="fields"
    :filters.sync="filters"
  >
    <template #filters>
      <list-filter-row>
        <list-filter-search />

        <list-filter-select
          v-if="$has.author"
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

    <template #header-table>
      <list-column-header
        text="Datum"
        order="date"
      />

      <list-column-header
        text="Title"
        order="title"
      />

      <list-column-header
        v-if="$has.author"
        text="Autor"
      />

      <list-column-header
        text="KOMMENTARE"
        order="count_comments"
      />

      <div>Tags</div>
    </template>

    <template #model-table="{ model: article }">
      <div class="info">
        {{ date(article) }}
      </div>

      <div>
        <router-link :to="article.getLink()">
          {{ article.title }}
        </router-link>
      </div>

      <div v-if="$has.author">
        <a
          href=""
          @click.prevent="clickAuthor(article.author)"
        >{{ article.author.name }}</a>
      </div>

      <div class="info">
        {{ article.count_comments }}
      </div>

      <div>
        <tag-list
          :model="article"
          @clickTag="clickTag"
        />
      </div>
    </template>
  </list-view>
</template>


<script>
import { Article } from '@/models'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ArticlesListView extends Vue {
  $hasOptions = ['author']

  static getListConfig (route) {
    return {
      ModelClass: Article,

      action: Article.getAction(route.meta.routeDefinition, 'get_articles'),

      scopes: {
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
    return ArticlesListView.getListConfig(this.$route).action
  }

  get scopes () {
    return ArticlesListView.getListConfig(this.$route).scopes
  }

  get fields () {
    return ArticlesListView.getListConfig(this.$route).fields
  }

  clickTag (tag) {
    this.filters.tag_id.value = tag.id
  }

  clickAuthor (author) {
    this.filters.author_id.value = author.id
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
