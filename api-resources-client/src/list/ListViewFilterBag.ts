import { Bag, BagEntries } from '../bag/Bag'
import { FilterValueType } from '../filter/Filter'
import { ListViewFilter } from './ListViewFilter'

export class ListViewFilterBag extends Bag<ListViewFilter> {
  public serialize (): BagEntries<FilterValueType> {
    const filters: BagEntries<FilterValueType> = {}
    for (const [name, filter] of this.entries()) {
      const value = filter.serialize()
      if (value !== undefined) {
        filters[name] = value
      }
    }
    return filters
  }
}
