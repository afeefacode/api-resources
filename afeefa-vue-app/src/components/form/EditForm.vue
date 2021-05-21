<template>
  <v-form
    v-model="valid"
    autocomplete="off"
  >
    <slot name="fields" />
  </v-form>
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { apiResources } from '@afeefa/api-resources-client'

@Component({
  props: ['model']
})
export default class EditForm extends Vue {
  valid = false

  @Watch('valid')
  validChanged () {
    let parent = this.$parent
    while (parent) {
      if (parent.$listeners['update:valid']) {
        parent.$emit('update:valid', this.valid)
        break
      }
      parent = parent.$parent
    }
  }

  get type () {
    return apiResources.getType(this.model.type)
  }
}
</script>
