<template>
  <div>
    <h3>Widget</h3>
    <ul>
      <li
        v-for="path in paths"
        :key="path"
      >
        {{ path }}
      </li>
    </ul>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Widget extends Vue {
  get paths () {
    const definition = this.$route.meta.routeDefinition
    return definition.getParentPathDefinitions().map(d => d.fullId)
  }
}
</script>
