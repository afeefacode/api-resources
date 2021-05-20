<template>
  <model-container :config="config" />
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ArticleContainer extends Vue {
  get config () {
    const api = this.$routeDefinition.config.api

    return {
      action: api.getAction('Example.ArticlesResource', 'get_article'),

      fields: {
        title: true,
        date: true,
        summary: true,
        content: true,
        author: {
          name: true
        },
        tags: {
          name: true,
          count_users: true
        },
        count_comments: true
      }
    }
  }
}
</script>
