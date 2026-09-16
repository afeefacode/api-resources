import { BagEntries } from '../bag/Bag.js'
import { ActionFilterValueType } from '../filter/ActionFilter.js'

export class ListViewFilterChangeEvent extends Event {
  public filters: BagEntries<ActionFilterValueType>

  constructor (type: string, filters: BagEntries<ActionFilterValueType>) {
    super(type)

    this.filters = filters
  }
}
