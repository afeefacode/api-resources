import { Component, Vue, Watch } from 'vue-property-decorator'

import { Filters } from './Filters'
import { RouteQuerySource } from './RouteQuerySource'

@Component
export class ListFiltersMixin extends Vue {
  lfm_filters = null

  lfm_init () {
    this.lfm_filters = new Filters(
      this.$route.path,
      this.Model.getFilters(),
      new RouteQuerySource(this.$router)
    )
  }

  // used to detect history changes
  // should not react to programmatic route changes
  @Watch('$route.query')
  lfm_routeQueryChanged () {
    const changed = this.lfm_filters.initFromQuerySource()
    if (changed) {
      this.lfm_filtersChanged()
    }
  }

  lfm_filtersChanged () {
    // override
  }

  lfm_serializeFilters () {
    return this.lfm_filters.serialize()
  }

  lfm_initFromUsed (numItems, usedFilters = {}, filterOptions = {}) {
    this.lfm_filters.initFromUsed(numItems, usedFilters, filterOptions)
  }
}
