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
      :model="model"
    />

    <v-btn>Speichern</v-btn>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model']
})
export default class EditRoute extends Vue {
  get Component () {
    return this.$routeDefinition.config.components.edit
  }
}
</script>


<style lang="scss" scoped>
button {
  display: block;
  margin: 2rem 0;
}
</style>
