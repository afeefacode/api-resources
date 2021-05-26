<template>
  <div>
    <router-link
      class="button"
      :to="model.getLink('edit')"
    >
      <v-btn>Bearbeiten</v-btn>
    </router-link>

    <component
      :is="Component"
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
  get Component () {
    return this.$routeDefinition.config.routing.detail.Component
  }
}
</script>


<style lang="scss" scoped>
.button {
  display: block;
  margin-bottom: 2rem;
}
</style>
