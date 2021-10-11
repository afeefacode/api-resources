<template>
  <edit-form v-bind="$attrs">
    <template #fields>
      <form-field
        name="author"
        label="Autor"
        :options="authorOptions()"
      />

      <form-field-text
        name="title"
        label="Titel"
      />
    </template>
  </edit-form>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ArticleCreateForm extends Vue {
  async authorOptions () {
    const api = this.$routeDefinition.config.api
    const result = await api.getAction('Example.AuthorResource', 'get_authors')
      .request()
      .fields({
        name: true
      })
      .send()

    return [
      ...result.data.map(i => {
        return {
          itemTitle: i.name,
          itemValue: i
        }
      })
    ]
  }
}
</script>
