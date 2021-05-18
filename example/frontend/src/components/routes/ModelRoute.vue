<template>
  <div>
    <a-loading-indicator :is-loading="isLoading" />

    <router-view
      v-if="model"
      :model="model"
    />
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class ModelRoute extends Vue {
  model = null
  isLoading = true

  created () {
    this.load()
  }

  @Watch('$route.params')
  routeParamsChanged (newParams, oldParams) {
    // do not reload if just sub route changes
    const idKey = this.$routeDefinition.idKey
    if (newParams[idKey] !== oldParams[idKey]) {
      this.load()
    }
  }

  get id () {
    const idKey = this.$routeDefinition.idKey
    return this.$route.params[idKey]
  }

  get config () {
    return this.$routeDefinition.config.route
  }

  get action () {
    return this.config.model.action
  }

  async load () {
    this.model = null
    this.isLoading = true

    const result = await this.action.request()
      .params({
        id: this.id
      })
      .fields(this.config.model.fields)
      .send()

    this.model = result.data
    this.isLoading = false

    // update breadcrumb
    const detailDefinition = this.$routeDefinition.getChild('detail')
    detailDefinition.setCustomBreadcrumbTitle(this.model.getTitle())
  }
}
</script>
