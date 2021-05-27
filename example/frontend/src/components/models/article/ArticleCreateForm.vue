<template>
  <edit-form v-bind="$attrs">
    <template #fields>
      <form-field
        name="author"
        :options="authorOptions()"
      />

      <form-field name="title" />
    </template>
  </edit-form>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ArticleCreateForm extends Vue {
  async authorOptions () {
    const api = this.$routeDefinition.config.api
    const result = await api.getAction('Example.AuthorsResource', 'get_authors')
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
