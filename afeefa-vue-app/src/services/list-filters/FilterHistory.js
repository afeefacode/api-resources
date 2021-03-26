class FilterHistory {
  filters = {}
  validFilters = {}

  getFilters (key, filterConfig) {
    if (!this.filters[key] || this.validFilters[key] === false) {
      this.filters[key] = filterConfig.map(f => f.clone())
    }
    return this.filters[key]
  }

  markFiltersValid (key, valid) {
    this.validFilters[key] = valid
  }
}

export const filterHistory = new FilterHistory()
