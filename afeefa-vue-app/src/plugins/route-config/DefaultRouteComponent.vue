<template>
  <div>
    Default {{ $routeDefinition.routeId }}
    <router-view />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class DefaultRouteComponent extends Vue {
}
</script>
