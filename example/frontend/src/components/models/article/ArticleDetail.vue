<template>
  <div>
    <detail-meta>
      Artikel #{{ article.id }}
      |
      von
      <router-link :to="article.getLink()">
        {{ article.author.name }}
      </router-link>
      |
      am {{ date }}
      |
      {{ article.count_comments }} Kommentare
    </detail-meta>

    <detail-title>
      {{ article.title }}
    </detail-title>

    <tag-list :model="model" />

    <p class="summary">
      {{ model.summary }}
    </p>

    <p>
      {{ model.content }}
    </p>
  </div>
</template>


<script>
import { Author } from '@/models'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model']
})
export default class ArticleDetail extends Vue {
  get article () {
    return this.model
  }

  get date () {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return this.article.date.toLocaleDateString('de-DE', options)
  }
}
</script>
