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

    <articles-list
      :filterHistoryKey="model.id + '.articles'"
      :filterSource="filterSource"
      :action="articlesAction"
      :fields="articlesFields"
    />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'
import ArticlesList from '@/components/article/ArticlesList'
import { ArticlesConfig } from '../article/ArticlesConfig'
import { QuerySourceType } from '@a-vue/components/list/QuerySourceType'

@Component({
  props: ['model'],
  components: {
    ArticlesList
  }
})
export default class AuthorDetail extends Vue {
  filterSource = QuerySourceType.OBJECT

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
