import { ApiAction } from '../api/ApiAction'
import { ApiRequest } from '../api/ApiRequest'
import { BagEntries } from '../bag/Bag'
import { ActionFilterValueType } from '../filter/ActionFilter'
import { ListViewFilter } from './ListViewFilter'
import { ListViewFilterBag } from './ListViewFilterBag'
import { ListViewFilterChangeEvent } from './ListViewFilterChangeEvent'
import { filterHistory } from './ListViewFilterHistory'
import { ListViewFilterSource } from './ListViewFilterSource'

export class ListViewModel {
  private _apiAction: ApiAction

  private _filterSource: ListViewFilterSource | null = null
  private _pushToFilterSource: boolean = false

  private _historyKey: string | null = null
  private _saveInHistory: boolean = false
  private _usedFilters: BagEntries<ActionFilterValueType> | null = null
  private _usedFiltersCount: number = 0
  private _filters: ListViewFilterBag = new ListViewFilterBag()

  private _eventTarget: EventTarget = new EventTarget()
  private _changedFilters: BagEntries<ActionFilterValueType> = {}
  private _changedFiltersTimeout: number | null = null
  private _lastSavedQuery: BagEntries<string> | null = null

  constructor (apiAction: ApiAction) {
    this._apiAction = apiAction

    const action = this._apiAction.getAction()
    if (action) {
      for (const [name, filter] of action.getFilters().entries()) {
        this._filters.add(name, new ListViewFilter(filter, this))
      }
    }
  }

  /**
   * Take all filters sources and some magic
   * and set up initial values for all available
   * filters.
   */
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

  public filterSource (filterSource: ListViewFilterSource, pushToFilterSource: boolean): ListViewModel {
    this._filterSource = filterSource
    this._pushToFilterSource = pushToFilterSource
    return this
  }

  public getFilterSource (): ListViewFilterSource | null {
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

  public getNonDefaultFilterNames (): string[] {
    const filterNames: string[] = []
    this._filters.values().forEach(f => {
      if (!f.hasDefaultValueSet()) {
        filterNames.push(f.name)
      }
    })
    return filterNames
  }

  public usedFilters (usedFilters: BagEntries<ActionFilterValueType> | null, count: number): ListViewModel {
    this._usedFilters = usedFilters
    this._usedFiltersCount = count
    return this
  }

  public getUsedFilters (): BagEntries<ActionFilterValueType> | null {
    return this._usedFilters
  }

  public getFilters (): ListViewFilterBag {
    return this._filters
  }

  public getFilter (name: string): ListViewFilter | null {
    return this._filters.get(name)
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
    if (this._filters.get(name)!.filter.type !== 'Afeefa.PageFilter') {
      const pageFilter = this._filters.values().find(f => f.filter.type === 'Afeefa.PageFilter')
      if (pageFilter) {
        pageFilter.reset()
      }
    }

    this._changedFilters[name] = this._filters.get(name)!.value

    this.dispatchChange()
  }

  public getApiRequest (): ApiRequest {
    const request = this._apiAction.getApiRequest()
    request.filters(this._filters.serialize())
    return request
  }

  /**
   * called if the the filter source has changed and should
   * be reinitialized (e.g. query string got modified)
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

    this._changedFilters = this.initFilterValues({
      source: true,
      history: false,
      used: false,
      filters: true
    })

    this.dispatchChange()

    // if a link without query is clicked,
    // and custom filters apply, then this should
    // be set to the query string
    this.pushToFilterSource()
  }

  public initFromUsedFilters (usedFilters: BagEntries<ActionFilterValueType>, count: number): void {
    this.setFilterValues(usedFilters)

    this.handleFilterHistory(count)

    this.pushToFilterSource()
  }

  public resetFilters (): void {
    this._changedFilters = {}

    this._filters.values().forEach(f => {
      const changed = f.reset()
      if (changed) {
        this._changedFilters[f.name] = f.value
      }
    })

    this.dispatchChange()
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

  private dispatchChange (): void {
    if (!Object.keys(this._changedFilters).length) {
      return
    }

    if (this._changedFiltersTimeout) {
      return
    }

    this._changedFiltersTimeout = window.setTimeout(() => {
      clearTimeout(this._changedFiltersTimeout!)
      this._changedFiltersTimeout = null

      this._eventTarget.dispatchEvent(new ListViewFilterChangeEvent('change', this._changedFilters))

      this._changedFilters = {}
    }, 10)
  }

  private initFilterValues (
    {source, history, used, filters}:
    {source: boolean, history: boolean, used: boolean, filters: boolean}
  ): BagEntries<ActionFilterValueType> {
    let filtersToUse: BagEntries<ActionFilterValueType> = {}

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
      filtersToUse = this._apiAction.getFilters() || {}
    }

    return this.setFilterValues(filtersToUse)
  }

  private setFilterValues (filters: BagEntries<ActionFilterValueType>): BagEntries<ActionFilterValueType> {
    const changedFilters: BagEntries<ActionFilterValueType> = {}

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

  private getFiltersFromFilterSource (): BagEntries<ActionFilterValueType> {
    const filters: BagEntries<ActionFilterValueType> = {}
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

  private getFiltersFromHistory (): BagEntries<ActionFilterValueType> {
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
