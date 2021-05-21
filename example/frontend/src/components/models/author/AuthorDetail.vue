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

    <articles-list :listId="listId" />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'
import ArticlesList from '@/components/models/article/ArticlesList'

@Component({
  props: ['model'],
  components: {
    ArticlesList
  }
})
export default class AuthorDetail extends Vue {
  get author () {
    return this.model
  }

  get listId () {
    return this.model.id + '.articles'
  }
}
</script>


<style lang="scss" scoped>
h2 {
  margin: 3rem 0;
}
</style>
