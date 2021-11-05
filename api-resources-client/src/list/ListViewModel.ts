import { ApiRequest } from '../api/ApiRequest'
import { BagEntries } from '../bag/Bag'
import { BaseFilterSource } from '../filter/BaseFilterSource'
import { FilterValueType } from '../filter/Filter'
import { FilterChangeEvent } from '../filter/FilterChangeEvent'
import { filterHistory } from '../filter/FilterHistory'
import { PageFilter } from '../filter/filters/PageFilter'
import { ListViewConfig } from './ListViewConfig'
import { ListViewFilter } from './ListViewFilter'
import { ListViewFilterBag } from './ListViewFilterBag'

export class ListViewModel {
  private _config: ListViewConfig

  private _filterSource: BaseFilterSource | null = null
  private _pushToFilterSource: boolean = false

  private _historyKey: string | null = null
  private _saveInHistory: boolean = false
  private _usedFilters: BagEntries<FilterValueType> | null = null
  private _usedFiltersCount: number = 0
  private _filters: ListViewFilterBag = new ListViewFilterBag()

  private _eventTarget: EventTarget = new EventTarget()
  private _changedFilters: BagEntries<FilterValueType> = {}
  private _changedFiltersTimeout: number | null = null
  private _lastSavedQuery: BagEntries<string> | null = null

  constructor (config: ListViewConfig) {
    this._config = config

    const action = this._config.getAction()
    if (action) {
      for (const [name, filter] of action.getFilters().entries()) {
        this._filters.add(name, new ListViewFilter(filter, this))
      }
    }
  }

  public getConfig (): ListViewConfig {
    return this._config
  }

  public initFilters (
    {source, history, used}:
    {source: boolean, history: boolean, used: boolean}
    = {source: false, history: false, used: false}
  ): ListViewModel {
    if (source && !this._filterSource) {
      console.warn('Can\'t init from filter source without setting up a filter source.')
    }

    if (history && !this._historyKey) {
      console.warn('Can\'t init from history without setting up a history key.')
    }

    if (used && !this._usedFilters) {
      console.warn('Can\'t init from used filters without setting up used filters.')
    }

    this.initFilterValues({source, history, used, filters: true})

    if (this._usedFilters) {
      this.handleFilterHistory(this._usedFiltersCount)
    }

    this.pushToFilterSource()

    return this
  }

  public filterSource (filterSource: BaseFilterSource, pushToFilterSource: boolean): ListViewModel {
    this._filterSource = filterSource
    this._pushToFilterSource = pushToFilterSource
    return this
  }

  public getFilterSource (): BaseFilterSource | null {
    return this._filterSource
  }

  public historyKey (historyKey: string, saveInHistory: boolean): ListViewModel {
    this._historyKey = historyKey
    this._saveInHistory = saveInHistory
    return this
  }

  public getHistoryKey (): string | null {
    return this._historyKey
  }

  public usedFilters (usedFilters: BagEntries<FilterValueType> | null, count: number): ListViewModel {
    this._usedFilters = usedFilters
    this._usedFiltersCount = count
    return this
  }

  public getUsedFilters (): BagEntries<FilterValueType> | null {
    return this._usedFilters
  }

  public getFilters (): ListViewFilterBag {
    return this._filters
  }

  public on (type: string, handler: () => {}): ListViewModel {
    this._eventTarget.addEventListener(type, handler)
    return this
  }

  public off (type: string, handler: () => {}): ListViewModel {
    this._eventTarget.removeEventListener(type, handler)
    return this
  }

  public filterValueChanged (name: string): void {
    // reset page filter if any other filter changes
    if (!(this._filters.get(name)!.filter instanceof PageFilter)) {
      const pageFilter = this._filters.values().find(f => f.filter instanceof PageFilter)
      if (pageFilter) {
        pageFilter.reset()
      }
    }

    this._changedFilters[name] = this._filters.get(name)!.value

    if (this._changedFiltersTimeout) {
      return
    }

    this._changedFiltersTimeout = setTimeout(() => {
      clearTimeout(this._changedFiltersTimeout!)
      this._changedFiltersTimeout = null
      this.dispatchChange(this._changedFilters)
      this._changedFilters = {}
    }, 10)
  }

  public getApiRequest (): ApiRequest | null {
    const action = this._config.getAction()
    if (action) {
      const request = action.createRequest()
        .params(this._config.getParams())
        .fields(this._config.getFields())
        .filters(this._filters.serialize())
      return request
    }
    return null
  }

  /**
   * called if the the filter sources has changed and should
   * be reinitialized
   */
  public filterSourceChanged (): void {
    if (!this._filterSource) {
      console.warn('Can\'t notify about changed filter source without setting up a filter source.')
      return
    }

    // source did not really change, this is a looped hook
    const query = this._filterSource.getQuery()
    if (JSON.stringify(this._lastSavedQuery) === JSON.stringify(query)) {
      return
    }

    const changedFilters = this.initFilterValues({
      source: true,
      history: false,
      used: false,
      filters: true
    })

    if (Object.keys(changedFilters).length) {
      this.dispatchChange(changedFilters)
    }
  }

  public initFromUsedFilters (usedFilters: BagEntries<FilterValueType>, count: number): void {
    this.setFilterValues(usedFilters)

    this.handleFilterHistory(count)

    this.pushToFilterSource()
  }

  public resetFilters (): void {
    const changedFilters: BagEntries<FilterValueType> = {}
    this._filters.values().forEach(f => {
      const changed = f.reset()
      if (changed) {
        changedFilters[f.name] = f.value
      }
    })

    if (Object.keys(changedFilters).length) {
      this.pushToFilterSource()

      this.dispatchChange(changedFilters)
    }
  }

  private handleFilterHistory (count: number): void {
    const historyKey = this._historyKey!

    if (this._saveInHistory) {
      if (!count) {
        filterHistory.removeFilters(historyKey)
      } else {
        // always overwrite saved filters with current ones
        filterHistory.setFilters(historyKey, this._filters)
      }
    }
  }

  private dispatchChange (changedFilters: BagEntries<FilterValueType>): void {
    this._eventTarget.dispatchEvent(new FilterChangeEvent('change', changedFilters))
  }

  private initFilterValues (
    {source, history, used, filters}:
    {source: boolean, history: boolean, used: boolean, filters: boolean}
  ): BagEntries<FilterValueType> {
    let filtersToUse: BagEntries<FilterValueType> = {}

    // check used filters
    if (used) {
      filtersToUse = this._usedFilters!

      history = false
      source = false
      filters = false
    }

    // check any already stored filters from a previous request
    if (history && filterHistory.hasFilters(this._historyKey!)) {
      filtersToUse = this.getFiltersFromHistory()

      source = false
      filters = false
    }

    if (source) {
      filtersToUse = this.getFiltersFromFilterSource()

      // source filters found, ignore any custom set up filter
      if (Object.keys(filtersToUse).length) {
        filters = false
      }
    }

    if (filters) {
      filtersToUse = this._config.getFilters()
    }

    return this.setFilterValues(filtersToUse)
  }

  private setFilterValues (filters: BagEntries<FilterValueType>): BagEntries<FilterValueType> {
    const changedFilters: BagEntries<FilterValueType> = {}

    // reset all filters not used
    for (const filter of this._filters.values()) {
      if (!filters.hasOwnProperty(filter.name)) {
        const changed = filter.reset()
        if (changed) {
          changedFilters[filter.name] = filter.value
        }
      }
    }

    // set filters to use
    for (const [name, value] of Object.entries(filters)) {
      const filter = this._filters.get(name)
      if (filter) {
        const changed = filter.setInternalValue(value)
        if (changed) {
          changedFilters[filter.name] = filter.value
        }
      }
    }

    return changedFilters
  }

  private getFiltersFromFilterSource (): BagEntries<FilterValueType> {
    const filters: BagEntries<FilterValueType> = {}
    const query = this._filterSource!.getQuery()

    for (const [name, filter] of this._filters.entries()) {
      const queryValue = query[name]
      if (queryValue) { // has query value, typeof === string
        const value = filter.queryToValue(queryValue) // query value valid
        if (value !== undefined) {
          filters[name] = value
        }
      }
    }
    return filters
  }

  private getFiltersFromHistory (): BagEntries<FilterValueType> {
    if (this._historyKey) {
      if (filterHistory.hasFilters(this._historyKey)) {
        const filters = filterHistory.getFilters(this._historyKey)
        return filters.serialize()
      }
    }
    return {}
  }

  private pushToFilterSource (): void {
    if (this._pushToFilterSource) {
      const query = this._filters.values()
        .reduce((map: BagEntries<string>, filter: ListViewFilter) => {
          return {
            ...map,
            ...filter.toQuerySource()
          }
        }, {})

      this._filterSource!.push(query)
      this._lastSavedQuery = query
    }
  }
}
