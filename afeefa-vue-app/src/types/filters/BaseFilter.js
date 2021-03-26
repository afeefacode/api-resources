export class BaseFilter {
  name = null
  title = null
  filter_type = null
  value = null

  clone () {
    const filter = new this.constructor()
    for (const key of Object.keys(this)) {
      filter[key] = this[key]
    }
    return filter
  }

  toUrlParams () {
    if (this.value) {
      return {
        [this.name]: this.value
      }
    }

    return {}
  }

  serialize () {
    if (this.value) {
      return {
        [this.name]: this.value
      }
    }

    return {}
  }

  initFromQuerySource (queryString) {
    if (queryString[this.name]) {
      this.value = queryString[this.name]
    } else {
      this.value = null
    }
  }

  initFromUsed (usedFilters, filterOptions) {
    if (usedFilters[this.name]) {
      this.value = usedFilters[this.name]
    }
  }

  reset () {
    this.value = null
  }
}
