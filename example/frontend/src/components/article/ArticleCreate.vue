<template>
  <create-page v-bind="$attrs">
    <template #fields>
      <form-field-select
        name="author"
        label="Autor"
      />

      <form-field-text
        name="title"
        label="Titel"
      />
    </template>
  </create-page>
</template>


<script>
import { Article } from '@/models'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ArticleCreate extends Vue {
  static get createRouteConfig () {
    return {
      ModelClass: Article,

      createAction: Article.getAction('create_article')
    }
  }
}
</script>
