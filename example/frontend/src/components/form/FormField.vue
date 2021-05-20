<template>
  <div>
    <template v-if="type === 'varchar'">
      <a-text-field
        v-model="model[name]"
        :label="name"
        :validator="validator"
      />
    </template>

    <template v-if="type === 'text'">
      <a-text-area
        v-model="model[name]"
        :label="name"
        :validator="validator"
      />
    </template>
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['type', 'name']
})
export default class FormField extends Vue {
  get model () {
    return this.$parent.$parent.model
  }

  get modelType () {
    return this.$parent.$parent.type
  }

  get field () {
    const fields = this.modelType.getUpdateFields()
    return fields[this.name]
  }

  get validator () {
    return this.field.getValidator()
  }
}
</script>
