import { BagEntries } from '../bag/Bag'
import { FilterValueType } from './Filter'

export class FilterChangeEvent extends Event {
  public filters: BagEntries<FilterValueType>

  constructor (type: string, filters: BagEntries<FilterValueType>) {
    super(type)

    this.filters = filters
  }
}
