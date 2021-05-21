<template>
  <edit-form :model="model">
    <template #fields>
      <form-field
        type="varchar"
        name="title"
      />
      <form-field
        type="text"
        name="summary"
      />
      <form-field
        type="text"
        name="content"
      />
    </template>
  </edit-form>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model']
})
export default class ArticleForm extends Vue {
  get config () {
    const api = this.$routeDefinition.config.api

    return {
      action: api.getAction('Example.ArticlesResource', 'update_article')
    }
  }
}
</script>
