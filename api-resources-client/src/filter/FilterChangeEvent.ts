import { Filters } from './RequestFilters'

export class FilterChangeEvent extends Event {
  public filters: Filters

  constructor (type: string, filters: Filters) {
    super(type)
    this.filters = filters
  }
}
