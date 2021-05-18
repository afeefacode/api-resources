class FilterHistory {
  filters = {}
  validFilters = {}

  createRequestFilters (routeId, action, querySource) {
    if (!this.filters[routeId] || this.validFilters[routeId] === false) {
      this.filters[routeId] = action.createRequestFilters(querySource)
    }
    return this.filters[routeId]
  }

  markFiltersValid (routeId, valid) {
    this.validFilters[routeId] = valid
  }
}

export const filterHistory = new FilterHistory()
