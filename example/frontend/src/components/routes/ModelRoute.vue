<template>
  <router-view
    v-if="model"
    :model="model"
    @update:model="reload"
  />
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { LoadingEvent } from '@avue/events'

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
    const idKey = this.idKey
    if (newParams[idKey] !== oldParams[idKey]) {
      this.load()
    }
  }

  get config () {
    return this.$routeDefinition.config.routing.model
  }

  get idKey () {
    return this.$routeDefinition.idKey
  }

  get id () {
    return this.$route.params[this.idKey]
  }

  get action () {
    return this.config.action
  }

  reload () {
    this.load()
  }

  async load () {
    this.model = null
    this.isLoading = true
    this.$events.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))

    const result = await this.action.request()
      .params({
        id: this.id
      })
      .fields(this.config.fields)
      .send()

    this.model = result.data

    this.isLoading = false
    this.$events.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))

    // update breadcrumb title
    const detailDefinition = this.$routeDefinition.getChild('detail')
    detailDefinition.setCustomBreadcrumbTitle(this.model.getTitle())
  }
}
</script>
