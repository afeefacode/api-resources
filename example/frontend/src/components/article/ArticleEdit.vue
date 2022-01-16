<template>
  <edit-page v-bind="$attrs">
    <template #fields>
      <form-field-select
        name="author"
        label="Autor"
      />

      <form-field-text
        name="title"
        label="Titel"
      />

      <form-field-text
        name="summary"
        label="Kurzbeschreibung"
      />

      <form-field-text
        name="content"
        label="Text"
      />
    </template>
  </edit-page>
</template>


<script>
import { Article } from '@/models'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ArticleEdit extends Vue {
  static get editRouteConfig () {
    return {
      ModelClass: Article,

      getAction: Article.getAction('get_article'),

      updateAction: Article.getAction('update_article'),

      fields: {
        title: true,
        summary: true,
        content: true,
        author: {
          name: true
        }
      }
    }
  }
}
</script>
