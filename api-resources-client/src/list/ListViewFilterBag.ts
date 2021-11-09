import { Bag, BagEntries } from '../bag/Bag'
import { ActionFilterValueType } from '../filter/ActionFilter'
import { ListViewFilter } from './ListViewFilter'

export class ListViewFilterBag extends Bag<ListViewFilter> {
  public serialize (): BagEntries<ActionFilterValueType> {
    const filters: BagEntries<ActionFilterValueType> = {}
    for (const [name, filter] of this.entries()) {
      const value = filter.serialize()
      if (value !== undefined) {
        filters[name] = value
      }
    }
    return filters
  }
}
