<template>
  <div>
    <router-link
      class="button"
      :to="model.getLink()"
    >
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
import { Component } from 'vue-property-decorator'
import BaseEditRoute from './base/BaseEditRoute'

@Component({
  props: ['model']
})
export default class EditRoute extends BaseEditRoute {
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
