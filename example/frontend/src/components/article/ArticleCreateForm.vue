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
    const result = await this.$apiResources.createRequest({resource: 'Example.AuthorResource', action: 'get_authors'})
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
