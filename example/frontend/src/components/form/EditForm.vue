<template>
  <div>
    <slot name="fields" />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'
import { apiResources } from '@afeefa/api-resources-client'

@Component({
  props: ['model']
})
export default class EditForm extends Vue {
  created () {
  }

  get type () {
    return apiResources.getType(this.model.type)
  }
}
</script>
