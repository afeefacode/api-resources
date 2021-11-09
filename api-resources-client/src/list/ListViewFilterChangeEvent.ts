import { BagEntries } from '../bag/Bag'
import { ActionFilterValueType } from '../filter/ActionFilter'

export class ListViewFilterChangeEvent extends Event {
  public filters: BagEntries<ActionFilterValueType>

  constructor (type: string, filters: BagEntries<ActionFilterValueType>) {
    super(type)

    this.filters = filters
  }
}
