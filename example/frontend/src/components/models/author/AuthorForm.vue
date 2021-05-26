<template>
  <edit-form :model="model">
    <template #fields>
      <form-field
        type="varchar"
        name="name"
      />
    </template>
  </edit-form>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model']
})
export default class AuthorForm extends Vue {
}
</script>
