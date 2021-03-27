<template>
  <p>
    Widget {{ $routeDefinition && $routeDefinition.routeId || 'No route definition' }}
  </p>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Widget extends Vue {
}
</script>
