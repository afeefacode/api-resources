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

    <tag-list :model="model" />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model']
})
export default class AuthorDetail extends Vue {
  get author () {
    return this.model
  }
}
</script>
