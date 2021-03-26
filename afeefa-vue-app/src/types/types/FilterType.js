import { KeywordFilter } from '../filters/KeywordFilter'
import { PageFilter } from '../filters/PageFilter'
import { SelectFilter } from '../filters/SelectFilter'

export default class FilterType {
  filter_type = null

  constructor (config) {
    this.filter_type = config.filter_type
  }

  createFilter (data) {
    let filter

    switch (data.filter_type) {
      case 'Kollektiv\\Select':
        filter = new SelectFilter()
        break
      case 'Kollektiv\\Keyword':
        filter = new KeywordFilter()
        break
      case 'Kollektiv\\Page':
        filter = new PageFilter()
        break
    }

    if (!filter) {
      console.error('There is no filter of class', data.filter_type)
    }

    filter.name = data.name
    filter.title = data.title
    filter.filter_type = data.filter_type

    return filter
  }
}
