<template>
  <list-card>
    <list-meta>
      Artikel #{{ article.id }}
      |
      von
      <router-link :to="article.author.getRoute('detail')">
        {{ article.author.name }}
      </router-link>
      |
      am {{ date }}
      |
      {{ article.count_comments }} Kommentare
    </list-meta>

    <list-title :link="article.getRoute('detail')">
      {{ article.title }}
    </list-title>

    <tag-list
      :model="article"
      @clickTag="clickTag"
    />
  </list-card>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model', 'filters']
})
export default class articleCard extends Vue {
  get article () {
    return this.model
  }

  get date () {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return this.article.date.toLocaleDateString('de-DE', options)
  }

  clickTag (tag) {
    this.filters.tag_id.value = tag.id
  }
}
</script>
