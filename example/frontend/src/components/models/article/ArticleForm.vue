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
}
</script>
