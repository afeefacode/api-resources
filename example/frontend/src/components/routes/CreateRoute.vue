<template>
  <div v-if="model">
    <router-link
      class="button"
      :to="listLink"
    >
      <v-btn>Ansehen</v-btn>
    </router-link>

    <component
      :is="Form"
      :model="model"
    />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class CreateRoute extends Vue {
  get config () {
    return this.$routeDefinition.config.route
  }

  get listLink () {
    return this.config.Model.getLink('list')
  }

  get Form () {
    return this.config.edit.Form
  }

  get model () {
    return new this.config.Model()
  }
}
</script>


<style lang="scss" scoped>
.button {
  display: block;
  margin-bottom: 2rem;
}
</style>
