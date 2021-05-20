<template>
  <div>
    <div class="filters">
      <slot name="filters" />
    </div>

    <template v-if="!isLoading && models.length">
      <div
        v-for="model in models"
        :key="model.id"
      >
        <slot
          name="model"
          :model="model"
        />
      </div>
    </template>

    <div v-else-if="!isLoading">
      Nichts gefunden. <a
        href=""
        @click.prevent="resetFilters()"
      >Filter zurücksetzen</a>
    </div>
  </div>
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteQuerySource } from '@avue/services/list-filters/RouteQuerySource'
import { filterHistory } from '@avue/services/list-filters/FilterHistory'
import { LoadingEvent } from '@avue/events'

@Component({
  props: ['config']
})
export default class ListView extends Vue {
  models = []
  meta = {}
  requestFilters = null
  isLoading = false

  created () {
    this.init()
  }

  destroyed () {
    this.requestFilters.off('change', this.filtersChanged)
  }

  init () {
    this.models = []
    this.meta = {}

    if (this.requestFilters) {
      this.requestFilters.off('change', this.filtersChanged)
    }

    this.requestFilters = filterHistory.createRequestFilters(
      this.listId,
      this.action,
      this.config.filterSource === 'route' ? new RouteQuerySource(this.$router) : null
    )

    this.$emit('update:filters', this.requestFilters.getFilters())

    this.requestFilters.on('change', this.filtersChanged)
    this.filtersChanged()
  }

  @Watch('$route.name')
  routeNameChanged () {
    this.init()
  }

  filtersChanged () {
    this.load()
  }

  get action () {
    return this.config.action
  }

  get filters () {
    return this.requestFilters.getFilters()
  }

  get listId () {
    return [this.$route.meta.routeDefinition.fullId, this.config.listId].filter(i => i).join('.')
  }

  resetFilters () {
    this.requestFilters.reset()
  }

  async load () {
    this.isLoading = true
    this.$events.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))

    this.$emit('update:isLoading', this.isLoading)

    const result = await this.action
      .request()
      .fields(this.config.fields)
      .filters(this.requestFilters.serialize())
      .send()

    this.models = result.data
    this.meta = result.meta

    this.requestFilters.initFromUsed(this.meta.used_filters)

    filterHistory.markFiltersValid(this.listId, this.meta.count_search > 0)

    this.isLoading = false
    this.$events.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))
    this.$emit('update:isLoading', this.isLoading)

    this.$emit('update:count', this.meta.count_search)
  }
}
</script>


<style lang="scss" scoped>
.filters {
  margin-bottom: 3rem;
}
</style>
