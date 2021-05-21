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
  lastJson = null

  created () {
    this.lastJson = this.json
  }

  get json () {
    return JSON.stringify(this.model)
  }

  get changed () {
    // console.log(this.json)
    // console.log(json)
    return this.json !== this.lastJson
  }

  @Watch('valid')
  validChanged () {
    this.$emitOnParent('update:valid', this.valid)
  }

  @Watch('changed')
  modelChanged () {
    this.$emitOnParent('update:changed', this.changed)
  }

  get type () {
    return apiResources.getType(this.model.type)
  }
}
</script>
