<template>
  <div class="breadcrumbs">
    <v-icon class="pr-1">
      $chevronRightIcon
    </v-icon>

    <v-breadcrumbs
      :items="paths"
      class="pa-0"
      dense
    >
      <template #divider>
        <v-icon>$chevronRightIcon</v-icon>
      </template>

      <template #item="{ item }">
        <v-breadcrumbs-item
          :to="item.to"
          :exact="true"
          :disabled="item.disabled"
        >
          {{ item.title.toUpperCase() }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'

export const breadcrumbEvent = new Vue()

@Component
export default class Breadcrumb extends Vue {
  breadcrumbEvent = breadcrumbEvent

  paths = []

  created () {
    this.breadcrumbEvent.$on('update', this.init)

    this.init()
  }

  @Watch('$route.name')
  routeNameChanged () {
    this.init()
  }

  init () {
    const definition = this.$route.meta.routeDefinition
    this.paths = definition.getBreadcrumbs().map(d => {
      return d.name !== 'root' && d.getBreadcrumb()
    }).filter(b => b)
  }
}
</script>


<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  align-items: center;

  ::v-deep .v-breadcrumbs__divider {
    padding: 0 4px 0 8px;
  }
}
</style>
