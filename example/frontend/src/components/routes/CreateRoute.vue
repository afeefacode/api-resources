<template>
  <div>
    <router-link
      class="button"
      :to="listLink"
    >
      <v-btn>Liste</v-btn>
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
    return this.config.Model.createForNew()
  }

  get config () {
    return this.$routeDefinition.config.routing.new
  }

  get listLink () {
    return this.config.Model.getLink('list')
  }
}
</script>


<style lang="scss" scoped>
.button {
  display: block;
  margin-bottom: 2rem;
}
</style>
