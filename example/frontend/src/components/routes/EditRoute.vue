<template>
  <div v-if="model">
    <router-link
      class="button"
      :to="routeConfig.getRoute('detail', model)"
    >
      <v-btn>Ansehen</v-btn>
    </router-link>

    <component
      :is="routeConfig.components.form"
      :model="model"
    />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model']
})
export default class EditRoute extends Vue {
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
