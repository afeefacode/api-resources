<template>
  <model-container :config="config" />
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AuthorContainer extends Vue {
  get config () {
    const api = this.$routeDefinition.config.api

    return {
      action: api.getAction('Example.AuthorsResource', 'get_author'),

      fields: {
        name: true,
        tags: {
          name: true,
          count_users: true
        },
        count_articles: true
      }
    }
  }
}
</script>
