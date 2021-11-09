import { BagEntries } from '../bag/Bag'
import { ActionFilterValueType } from './ActionFilter'

export class FilterChangeEvent extends Event {
  public filters: BagEntries<ActionFilterValueType>

  constructor (type: string, filters: BagEntries<ActionFilterValueType>) {
    super(type)

    this.filters = filters
  }
}
