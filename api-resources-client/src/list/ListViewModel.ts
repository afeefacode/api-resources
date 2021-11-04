import { ApiRequest } from '../api/ApiRequest'
import { BagEntries } from '../bag/Bag'
import { BaseFilterSource } from '../filter/BaseFilterSource'
import { FilterValueType } from '../filter/Filter'
import { FilterChangeEvent } from '../filter/FilterChangeEvent'
import { filterHistory } from '../filter/FilterHistory'
import { ListViewConfig } from './ListViewConfig'
import { ListViewFilter } from './ListViewFilter'
import { ListViewFilterBag } from './ListViewFilterBag'

export class ListViewModel {
  private _config: ListViewConfig
  private _filterSource: BaseFilterSource | null = null
  private _historyKey: string | null = null
  private _filters: ListViewFilterBag = new ListViewFilterBag()

  private _eventTarget: EventTarget = new EventTarget()
  private changedFilters: BagEntries<FilterValueType> = {}
  private changedFiltersTimeout: number | null = null

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
    {filterSource, historyKey}:
    {filterSource?: BaseFilterSource, historyKey?: string} = {}
  ): ListViewModel {
    this._filterSource = filterSource || null
    this._historyKey = historyKey || null
    this.initFilterValues()
    return this
  }

  public getFilterSource (): BaseFilterSource | null {
    return this._filterSource
  }

  public getHistoryKey (): string | null {
    return this._historyKey
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
    this.changedFilters[name] = this._filters.get(name)!.value

    if (this.changedFiltersTimeout) {
      return
    }

    this.changedFiltersTimeout = setTimeout(() => {
      clearTimeout(this.changedFiltersTimeout!)
      this.changedFiltersTimeout = null
      this.dispatchChange(this.changedFilters)
      this.changedFilters = {}
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
    let filtersToUse: BagEntries<FilterValueType> = {}

    if (this._filterSource) {
      filtersToUse = this.getFiltersFromFilterSource()
    }

    this.setFilterValues(filtersToUse)
  }

  public initFromUsedFilters (usedFilters: BagEntries<FilterValueType>, count: number): void {
    this.setFilterValues(usedFilters)

    this.pushToQuerySource()

    if (this._historyKey && !count) {
      filterHistory.removeFilters(this._historyKey)
    }
  }

  public resetFilters (): void {
    const changedFilters: BagEntries<FilterValueType> = {}
    this._filters.values().forEach(f => {
      const changed = f.reset()
      if (changed) {
        changedFilters[f.name] = f.value
      }
    })

    this.pushToQuerySource()

    console.log('dispatch change', changedFilters)
    this.dispatchChange(changedFilters)
  }

  private dispatchChange (changedFilters: BagEntries<FilterValueType>): void {
    this._eventTarget.dispatchEvent(new FilterChangeEvent('change', changedFilters))
  }

  private initFilterValues (): void {
    let filtersToUse: BagEntries<FilterValueType> = {}

    // create and init request filters based on the current filter source state
    if (this._filterSource) {
      filtersToUse = this.getFiltersFromFilterSource()
    }

    // no filters based on filter source found, check history
    if (!Object.keys(filtersToUse).length && this._historyKey) {
      // check any already stored filters from a previous request
      filtersToUse = this.getFiltersFromHistory()
    }

    // no source or history filters found, check given filters at last
    if (!Object.keys(filtersToUse).length) {
      filtersToUse = this._config.getFilters()
    }

    this.setFilterValues(filtersToUse)
  }

  private setFilterValues (filters: BagEntries<FilterValueType>): void {
    // reset all filters not used
    for (const filter of this._filters.values()) {
      if (!filters.hasOwnProperty(filter.name)) {
        filter.reset()
      }
    }

    // set filters to use
    for (const [name, value] of Object.entries(filters)) {
      const filter = this._filters.get(name)
      if (filter) {
        filter.setInternalValue(value)
      }
    }
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
        const historyFilters = filterHistory.getFilters(this._historyKey)
        return historyFilters.serialize()
      }
    }
    return {}
  }

  private pushToQuerySource (): void {
    const query = this._filters.values().reduce((map: BagEntries<string>, filter: ListViewFilter) => {
      return {
        ...map,
        ...filter.toQuerySource()
      }
    }, {})

    if (this._filterSource) {
      this._filterSource.push(query)
    }

    // this._lastQuery = query
  }
}
