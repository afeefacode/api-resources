import { Filter } from './Filter'

export class FilterChangeEvent extends Event {
  public filter: Filter

  constructor (type: string, filter: Filter) {
    super(type)
    this.filter = filter
  }
}
