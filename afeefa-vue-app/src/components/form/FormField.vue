<template>
  <div v-if="field">
    <template v-if="field.type === 'Afeefa.VarcharAttribute'">
      <a-text-field
        v-model="model[name]"
        :label="name"
        :validator="validator"
      />
    </template>

    <template v-if="field.type === 'Afeefa.TextAttribute'">
      <a-text-area
        v-model="model[name]"
        :label="name"
        :validator="validator"
      />
    </template>

    <template v-if="field.type === 'Afeefa.LinkOneRelation'">
      <a-select
        v-model="model[name]"
        :label="name"
        :items="options"
        itemText="itemTitle"
        itemValue="itemValue"
        :clearable="clearable && model[name] !== null"
        :validator="validator"
        v-bind="$attrs"
      />
    </template>
  </div>

  <div v-else>
    Form field {{ name }} not configured in api schema
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'
import { apiResources } from '@afeefa/api-resources-client'

@Component({
  props: ['name', 'options', 'clearable']
})
export default class FormField extends Vue {
  get model () {
    return this.$parent.$parent.model
  }

  get modelType () {
    return apiResources.getType(this.model.type)
  }

  get field () {
    const fields = this.model.id ? this.modelType.getUpdateFields() : this.modelType.getCreateFields()
    return fields[this.name]
  }

  get validator () {
    return this.field.getValidator()
  }
}
</script>
