import { BagEntries } from '../bag/Bag'
import { ListViewFilterBag } from '../list/ListViewFilterBag'

class FilterHistory {
  private filters: BagEntries<ListViewFilterBag> = {}

  public hasFilters (historyKey: string): boolean {
    return !!this.filters[historyKey]
  }

  public getFilters (historyKey: string): ListViewFilterBag {
    return this.filters[historyKey]!
  }

  public setFilters (historyKey: string, filters: ListViewFilterBag): void {
    this.filters[historyKey] = filters
  }

  public removeFilters (historyKey: string): void {
    delete this.filters[historyKey]
  }
}

export const filterHistory = new FilterHistory()
