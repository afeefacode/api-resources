import { BagEntries } from '../bag/Bag'
import { Filter } from './Filter'

export class FilterChangeEvent extends Event {
  public filters: BagEntries<Filter>

  constructor (type: string, filters: BagEntries<Filter>) {
    super(type)

    this.filters = filters
  }
}
