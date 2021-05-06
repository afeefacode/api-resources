<template>
  <list-card>
    <list-meta>
      Autor #{{ author.id }}
      |
      {{ author.count_articles }} Artikel
    </list-meta>

    <list-title :link="authorsRouteConfig.getRoute('detail', author)">
      {{ author.name }}
    </list-title>

    <tag-list
      :model="author"
      @clickTag="clickTag"
    />
  </list-card>
</template>

<script>
import { Author } from '@/models'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model', 'filters']
})
export default class AuthorCard extends Vue {
  get author () {
    return this.model
  }

  clickTag (tag) {
    this.filters.tag_id.value = tag.id
  }

  get authorsRouteConfig () {
    return new Author.RouteConfig()
  }
}
</script>
