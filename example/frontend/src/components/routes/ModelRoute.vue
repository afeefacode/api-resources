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

  get routeConfig () {
    return this.$routeDefinition.config.route
  }

  get action () {
    return this.routeConfig.getAction
  }

  async load () {
    this.routeConfig.setRouteModel(null)

    const result = await this.action.request()
      .params({
        id: this.id
      })
      .fields(this.routeConfig.getFields)
      .send()

    this.model = result.data

    this.routeConfig.setRouteModel(this.model)
  }
}
</script>
