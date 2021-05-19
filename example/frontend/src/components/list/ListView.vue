<template>
  <div>
    <slot name="filters" />

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
  </div>
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteQuerySource } from '@avue/services/list-filters/RouteQuerySource'
import { filterHistory } from '@avue/services/list-filters/FilterHistory'

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
      this.config.listId,
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

  get newLink () {
    return this.config.Model.getLink('new')
  }

  get Card () {
    return this.config.Card
  }

  get Filters () {
    return this.config.Filters
  }

  resetFilters () {
    this.requestFilters.reset()
  }

  async load () {
    this.isLoading = true

    const result = await this.action
      .request()
      .fields(this.config.fields)
      .filters(this.requestFilters.serialize())
      .send()

    this.models = result.data
    this.meta = result.meta

    this.requestFilters.initFromUsed(this.meta.used_filters)

    filterHistory.markFiltersValid(this.config.listId, this.meta.count_search > 0)

    this.isLoading = false

    this.$emit('update:count', this.meta.count_search)
  }
}
</script>


<style lang="scss" scoped>
.filters {
  margin-bottom: 3rem;
}
</style>
