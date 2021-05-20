<template>
  <div v-if="model">
    <router-link
      class="button"
      :to="listLink"
    >
      <v-btn>Ansehen</v-btn>
    </router-link>

    <component
      :is="Component"
      :model="model"
    />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class CreateRoute extends Vue {
  get config () {
    return this.$routeDefinition.config
  }

  get listLink () {
    return this.config.Model.getLink('list')
  }

  get Component () {
    return this.config.components.new
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
