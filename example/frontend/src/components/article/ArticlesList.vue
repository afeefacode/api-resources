<template>
  <list-page :ModelClass="Article">
    <articles-list-view v-bind="$attrs" />
  </list-page>
</template>


<script>
import { Article } from '@/models'
import { Component, Vue } from 'vue-property-decorator'
import ArticlesListView from './ArticlesListView'

@Component({
  components: {
    ArticlesListView
  }
})
export default class ArticlesPage extends Vue {
  static getListConfig (route) {
    return ArticlesListView.getListConfig(route)
  }

  Article = Article
}
</script>
