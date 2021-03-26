import { filterHistory } from './FilterHistory'

export class Filters {
  key = null
  filterConfig = []
  querySource = {}
  filters = []

  numItems = null
  lastQuery = {}

  constructor (key, filterConfig, querySource) {
    this.key = key
    this.filterConfig = filterConfig
    this.filters = filterHistory.getFilters(key, filterConfig)
    this.querySource = querySource

    this.initFromQuerySource()
  }

  initFromUsed (numItems, usedFilters = {}, filterOptions = {}) {
    this.numItems = numItems
    filterHistory.markFiltersValid(this.key, numItems > 0)

    this.filters.forEach(f => f.initFromUsed(usedFilters, filterOptions))
    this.pushToQuerySource()
  }

  initFromQuerySource () {
    const query = this.querySource.getQuery()

    if (JSON.stringify(this.lastQuery) === JSON.stringify(query)) {
      return false
    }

    this.filters.forEach(f => f.initFromQuerySource(query))

    this.lastQuery = query

    return true
  }

  pushToQuerySource () {
    const query = this.filters.reduce(function (map, filter) {
      return {
        ...map,
        ...filter.toUrlParams()
      }
    }, {})

    this.querySource.push(query)

    this.lastQuery = query
  }

  get pagination () {
    return this.filters.find(f => f.filter_type === 'Kollektiv\\Page')
  }

  resetFilters () {
    this.filters.forEach(f => {
      f.reset()
    })
    this.pushToQuerySource()
  }

  serialize () {
    return this.filters.reduce(function (map, filter) {
      map = {
        ...map,
        ...filter.serialize()
      }
      return map
    }, {})
  }
}
