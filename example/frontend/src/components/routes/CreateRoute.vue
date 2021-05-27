<template>
  <div>
    <router-link :to="listLink">
      <v-btn>Liste</v-btn>
    </router-link>

    <p v-if="modelToEdit">
      JSON {{ json }}
    </p>

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
        Anlegen
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

@Component
export default class CreateRoute extends BaseEditRoute {
  createModelToEdit () {
    return this.config.Model.createForNew(this.fields)
  }

  get config () {
    return this.$routeDefinition.config.routing.new
  }

  get fields () {
    return this.config.fields
  }

  get listLink () {
    return this.config.Model.getLink('list')
  }

  saved (model) {
    this.ignoreChanged = true
    this.$router.push(model.getLink('edit'))
  }
}
</script>


<style lang="scss" scoped>
button {
  display: block;
  margin: 2rem 0;
}
</style>
