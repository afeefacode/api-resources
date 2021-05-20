<template>
  <div>
    <router-link
      class="button"
      :to="newLink"
    >
      <v-btn>Neu</v-btn>
    </router-link>

    <component
      :is="Component"
      v-bind="componentProps"
    />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ListRoute extends Vue {
  get config () {
    return this.$routeDefinition.config
  }

  get newLink () {
    return this.config.Model.getLink('new')
  }

  get Component () {
    const list = this.config.components.list
    return Array.isArray(list) ? list[0] : list
  }

  get componentProps () {
    const list = this.config.components.list
    return Array.isArray(list) ? list[1] : null
  }
}
</script>


<style lang="scss" scoped>
.button {
  display: block;
  margin-bottom: 2rem;
}
</style>
