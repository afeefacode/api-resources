<template>
  <div v-if="model">
    <router-link
      class="button"
      :to="routeConfig.getRoute('edit', model)"
    >
      <v-btn>Bearbeiten</v-btn>
    </router-link>

    <component
      :is="routeConfig.components.detail"
      :model="model"
    />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model']
})
export default class DetailRoute extends Vue {
  get routeConfig () {
    return this.$routeDefinition.config.route
  }
}
</script>


<style lang="scss" scoped>
.button {
  display: block;
  margin-bottom: 2rem;
}
</style>
