<template>
  <detail-page
    v-bind="$attrs"
    :has="{edit: true}"
    @model="author = $event"
  >
    <template #model="{model: author}">
      <detail-meta>
        Autor #{{ author.id }}
        |
        {{ author.count_articles }} Artikel
      </detail-meta>

      <detail-title>
        {{ author.name }}
      </detail-title>

      <tag-list :model="author" />

      <h2>Artikel</h2>

      <articles-list-view
        :author_id="$route.params.authorId"
        :filterHistoryKey="author.id + '.articles'"
        :filterSource="filterSource"
        :has="{author: false}"
      />
    </template>
  </detail-page>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'
import ArticlesListView from '@/components/article/ArticlesListView'
import { FilterSourceType } from '@a-vue/components/list/FilterSourceType'
import { Author } from '@/models'

@Component({
  components: {
    ArticlesListView
  }
})
export default class AuthorDetail extends Vue {
  author = null

  filterSource = FilterSourceType.OBJECT

  static getDetailRouteConfig () {
    return {
      ModelClass: Author,

      action: Author.getAction('get_author'),

      removeAction: Author.getAction('save_author'),

      fields: {
        name: true,
        tags: {
          name: true,
          count_users: true
        },
        count_articles: true
      }
    }
  }
}
</script>


<style lang="scss" scoped>
h2 {
  margin: 3rem 0;
}
</style>
