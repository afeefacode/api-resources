<template>
  <list-page :Model="Article">
    <articles-list-view v-bind="$attrs" />
  </list-page>
</template>


<script>
import { Article } from '@/models'
import { Component, Vue } from 'vue-property-decorator'
import ArticlesListView, { getListViewConfig } from './ArticlesListView'

@Component({
  components: {
    ArticlesListView
  }
})
export default class ArticlesList extends Vue {
  static get listViewConfig () {
    return getListViewConfig()
  }

  Article = Article
}
</script>
