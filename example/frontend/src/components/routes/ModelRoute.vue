<template>
  <div v-if="model">
    <router-view :model="model" />
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class ModelRoute extends Vue {
  model = null

  created () {
    this.load()
  }

  @Watch('$route.name')
  routeNameChanged () {
    this.load()
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

    const result = await this.action.request()
      .params({
        id: this.id
      })
      .fields(this.config.model.fields)
      .send()

    this.model = result.data

    // update breadcrumb
    const detailDefinition = this.$routeDefinition.getChild('detail')
    detailDefinition.setCustomBreadcrumbTitle(this.model.getTitle())
  }
}
</script>
