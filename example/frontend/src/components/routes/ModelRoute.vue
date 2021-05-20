<template>
  <component :is="Component" />
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ModelRoute extends Vue {
  get Component () {
    return this.$routeDefinition.config.components.model
  }
}
</script>
