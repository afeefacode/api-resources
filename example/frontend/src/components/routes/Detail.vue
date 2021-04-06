<template>
  <div>
    <h3>Detail</h3>
    <ul>
      <li>{{ $routeDefinition.fullId }}</li>
      <li>{{ $routeDefinition.fullName }}</li>
      <li>{{ $routeDefinition.fullPath }}</li>
    </ul>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Detail extends Vue {
}
</script>
