<template>
  <div>
    <div>
      <h3>Default</h3>
      <ul>
        <li>{{ $routeDefinition.fullId }}</li>
        <li>{{ $routeDefinition.fullName }}</li>
        <li>{{ $routeDefinition.fullPath }}</li>
      </ul>
    </div>
    <router-view />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class DefaultRouteComponent extends Vue {
}
</script>
