class FilterHistory {
  filters = {}
  invalidFilters = {}

  getFilters (path, filters) {
    if (!this.filters[path] || this.invalidFilters[path]) {
      this.filters[path] = filters.map(f => f.clone())
    }
    return this.filters[path]
  }

  markFiltersInvalid (path) {
    this.invalidFilters[path] = true
  }
}

export const filterHistory = new FilterHistory()
