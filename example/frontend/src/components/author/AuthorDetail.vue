<template>
  <div>
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
      :filterHistoryKey="model.id + '.articles'"
      :filterSource="filterSource"
      :has="{author: false}"
    />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'
import ArticlesListView from '@/components/article/ArticlesListView'
import { FilterSourceType } from '@a-vue/components/list/FilterSourceType'
import { Author } from '@/models'

@Component({
  props: ['model'],
  components: {
    ArticlesListView
  }
})
export default class AuthorDetail extends Vue {
  filterSource = FilterSourceType.OBJECT

  static getDetailConfig () {
    return {
      action: Author.getAction('get_author'),

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

  get author () {
    return this.model
  }
}
</script>


<style lang="scss" scoped>
h2 {
  margin: 3rem 0;
}
</style>
