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
      :filterHistoryKey="model.id + '.articles'"
      :filterSource="filterSource"
      :has="{author: false}"
    />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'
import ArticlesListView from '@/components/article/ArticlesListView'
import { ArticlesConfig } from '@/components/article/ArticlesConfig'
import { QuerySourceType } from '@a-vue/components/list/QuerySourceType'
import { Author } from '@/models'

@Component({
  props: ['model'],
  components: {
    ArticlesListView
  }
})
export default class AuthorDetail extends Vue {
  filterSource = QuerySourceType.OBJECT

  static getDetailConfig (route) {
    return {
      action: Author.getAction(route.meta.routeDefinition, 'get_author'),

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

  get articlesAction () {
    const api = this.$routeDefinition.config.api
    return new ArticlesConfig(api).list.action
  }

  get articlesFields () {
    const api = this.$routeDefinition.config.api
    return new ArticlesConfig(api).list.fields
  }
}
</script>


<style lang="scss" scoped>
h2 {
  margin: 3rem 0;
}
</style>
