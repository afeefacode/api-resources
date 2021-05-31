import { filterHistory } from '@afeefa/api-resources-client'
import { Component, Vue, Watch } from 'vue-property-decorator'

import { RouteQuerySource } from '../../api-resources/RouteQuerySource'
import { LoadingEvent } from '../loading-indicator/LoadingEvent'

@Component({
  props: ['listId', 'filterSource', 'action', 'fields']
})
export default class ListViewMixin extends Vue {
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
      this.internalListId,
      this.action,
      this.filterSource === 'route' ? new RouteQuerySource(this.$router) : null
    )

    this.$emit('update:filters', this.requestFilters.getFilters())

    this.requestFilters.on('change', this.filtersChanged)
    this.filtersChanged()
  }

  @Watch('$route.name')
  routeNameChanged () {
    this.init()
  }

  // @Watch('$route.query')
  // routeQueryChanged () {
  //   console.log('route query changed', this.$route.query)
  // }

  filtersChanged () {
    this.load()
  }

  get filters () {
    return this.requestFilters.getFilters()
  }

  get internalListId () {
    return [this.$route.meta.routeDefinition.fullId, this.listId].filter(i => i).join('.')
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
      .fields(this.fields)
      .filters(this.requestFilters.serialize())
      .send()

    this.models = result.data
    this.meta = result.meta

    this.requestFilters.initFromUsed(this.meta.used_filters)

    filterHistory.markFiltersValid(this.internalListId, this.meta.count_search > 0)

    this.isLoading = false
    this.$events.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))
    this.$emit('update:isLoading', this.isLoading)

    this.$emit('update:count', this.meta.count_search)
  }
}
