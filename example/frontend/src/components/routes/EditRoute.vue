<template>
  <div>
    <router-link :to="model.getLink()">
      <v-btn>Ansehen</v-btn>
    </router-link>

    <component
      :is="Component"
      :model="modelToEdit"
      :valid.sync="valid"
      :changed.sync="changed"
    />

    <v-row>
      <v-btn
        :disabled="!changed || !valid"
        @click="save"
      >
        Speichern
      </v-btn>

      <v-btn
        v-if="changed"
        text
        @click="reset"
      >
        Zurücksetzen
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import { Component, Mixins } from 'vue-property-decorator'
import EditRouteMixin from './base/EditRouteMixin'

@Component({
  props: ['model']
})
export default class EditRoute extends Mixins(EditRouteMixin) {
  createModelToEdit () {
    return this.model.cloneForEdit(this.fields)
  }

  get saveParams () {
    return {
      id: this.model.id
    }
  }
}
</script>


<style lang="scss" scoped>
button {
  display: block;
  margin: 2rem 0;
}
</style>
