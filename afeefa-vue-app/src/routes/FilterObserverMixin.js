import { Component, Vue } from 'vue-property-decorator'

import { filterHistory } from './FilterHistory'

@Component
export class FilterObserverMixin extends Vue {
  fom_filters = []
  fom_unwatchers = []
  fom_skipReload = false

  destroyed () {
    this.fom_unwatchers.forEach(unwatch => unwatch())
  }

  fom_initFilters (availableFilters) {
    this.fom_filters = filterHistory.getFilters(this.$route.path, availableFilters)

    this.fom_initFiltersFromRoute()

    this.fom_watchFilters()

    return this.fom_filters
  }

  fom_watchFilters () {
    this.fom_unwatchers.forEach(unwatch => unwatch())

    for (const index in this.fom_filters) {
      const filter = this.fom_filters[index]

      const unwatch = this.$watch(`fom_filters.${index}.value`, () => {
        this.fom_filterChanged(filter)
      }, {deep: true})

      this.fom_unwatchers.push(unwatch)
    }
  }

  fom_filterChanged (filter) {
    if (this.fom_skipReload) { // changed by setting used filters
      return
    }

    this.fom_updateRouteParams()

    this.fom_filtersChanged()
  }

  fom_filtersChanged () {
    // do something about
  }

  fom_updateRouteParams () {
    const query = this.fom_filters.reduce(function (map, filter) {
      return {
        ...map,
        ...filter.toUrlParams()
      }
    }, {})

    if (JSON.stringify(this.$route.query) !== JSON.stringify(query)) {
      this.$router.push({query})
    }
  }

  fom_initFiltersFromRoute () {
    const query = this.$route.query
    this.fom_filters.forEach(f => f.initFromUrl(query))
  }

  fom_initFiltersFromUsed (usedFilters = {}, filterOptions = {}) {
    this.fom_skipReload = true
    this.fom_filters.forEach(f => f.initFromUsed(usedFilters, filterOptions))

    this.$nextTick(() => {
      this.fom_skipReload = false
    })

    this.fom_updateRouteParams()
  }

  fom_toApiFilters () {
    return this.fom_filters.reduce(function (map, filter) {
      if (filter.value) {
        map[filter.name] = filter.value
      }
      return map
    }, {})
  }

  fom_resetFilters (filterName = null) {
    this.fom_filters.forEach(f => {
      if (filterName) {
        if (filterName === f.name) {
          f.reset()
        }
      } else {
        f.reset()
      }
    })
  }

  fom_getFilter (filterName) {
    return this.fom_filters.find(f => f.name === filterName)
  }

  fom_hasFilterValue (filterName) {
    const query = this.$route.query
    return !!query[filterName]
  }

  fom_hasOtherFilterValue (filterName) {
    const query = this.$route.query
    return !!Object.keys(query).find(k => k !== filterName && query[k])
  }

  fom_markFiltersInvalid () {
    filterHistory.markFiltersInvalid(this.$route.path)
  }
}
