import { Bag, BagEntries } from '../bag/Bag.js'
import { ActionFilterValueType } from '../filter/ActionFilter.js'
import { ListViewFilter } from './ListViewFilter.js'

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
