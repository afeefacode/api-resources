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

    const querySource = this.filterSource === 'route' ? new RouteQuerySource(this.$router) : undefined
    this.requestFilters = this.action.createRequestFilters(this.internalListId, querySource)

    this.$emit('update:filters', this.requestFilters.getFilters())

    this.requestFilters.on('change', this.filtersChanged)

    this.load()
  }

  @Watch('$route.query')
  routeQueryChanged () {
    this.requestFilters.querySourceChanged()
  }

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

    this.requestFilters.initFromUsed(this.meta.used_filters, this.meta.count_search)

    this.isLoading = false
    this.$events.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))
    this.$emit('update:isLoading', this.isLoading)

    this.$emit('update:count', this.meta.count_search)
  }
}
