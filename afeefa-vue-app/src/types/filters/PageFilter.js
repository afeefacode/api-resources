import { BaseFilter } from './BaseFilter'

export class PageFilter extends BaseFilter {
  value = {
    page: 1,
    page_size: 15
  }

  toUrlParams () {
    if (this.value.page > 1) {
      return {
        page: this.value.page.toString()
        // page_size: this.value.page_size.toString()
      }
    }

    return {}
  }

  serialize () {
    return {
      [this.name]: this.value
    }
  }

  initFromQuerySource (queryString) {
    if (queryString.page) {
      this.value.page = parseInt(queryString.page)
    } else {
      this.reset()
    }

    // if (queryString.page_size) {
    //   this.value.page = parseInt(queryString.page_size)
    // }
  }

  initFromUsed (usedFilters) {
    if (usedFilters.page) {
      this.value.page = usedFilters.page.page
      this.value.page_size = usedFilters.page.page_size
    }
  }

  reset () {
    this.value = {
      page: 1,
      page_size: 10
    }
  }
}
