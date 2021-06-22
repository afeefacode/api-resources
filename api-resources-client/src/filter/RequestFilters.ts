import { ActionFilters } from '../action/Action'
import { filterHistory } from '../filter/FilterHistory'
import { BaseFilterSource, QuerySource } from './BaseFilterSource'
import { Filter, FilterValueType } from './Filter'
import { FilterChangeEvent } from './FilterChangeEvent'
import { PageFilter } from './filters/PageFilter'
import { ObjectFilterSource } from './ObjectFilterSource'

export type Filters = Record<string, Filter>
export type UsedFilters = Record<string, FilterValueType>

/**
 * Request filters do have multiple change entry points:
 * - create: read existing query string and init filter values -> consumer should initially -> LOAD
 * - get from history: consumer should initially -> LOAD
 * - click: update filter values and update query string  -> RELOAD
 * - query changed: update filter values -> RELOAD
 * - init used filters: update filter values and update query string
 */
export class RequestFilters {
  private _filters: Filters = {}
  private _historyKey?: string
  private _querySource: BaseFilterSource

  private _lastQuery: QuerySource = {}
  private _disableUpdates: boolean = false

  private _eventTarget: EventTarget = new EventTarget()

  public static create (filters: ActionFilters, historyKey?: string, querySource?: BaseFilterSource): RequestFilters {
    let requestFilters: RequestFilters
    querySource = querySource || new ObjectFilterSource({})

    if (historyKey) {
      if (filterHistory.hasFilters(historyKey)) {
        requestFilters = filterHistory.getFilters(historyKey)
      } else {
        requestFilters = new RequestFilters(filters, historyKey, querySource)
        filterHistory.addFilters(historyKey, requestFilters)
      }
    } else {
      requestFilters = new RequestFilters(filters, undefined, querySource)
    }

    return requestFilters
  }

  public static fromHistory (historyKey: string): RequestFilters | null {
    if (filterHistory.hasFilters(historyKey)) {
      return filterHistory.getFilters(historyKey)
    } else {
      return null
    }
  }

  constructor (filters: ActionFilters, historyKey?: string, querySource?: BaseFilterSource) {
    this._historyKey = historyKey
    this._querySource = querySource || new ObjectFilterSource({})

    for (const [name, filter] of Object.entries(filters)) {
      this._filters[name] = filter.createRequestFilter(this)
    }

    this.initFromQuerySource()
  }

  public on (type: string, handler: () => {}): void {
    this._eventTarget.addEventListener(type, handler)
  }

  public off (type: string, handler: () => {}): void {
    this._eventTarget.removeEventListener(type, handler)
  }

  public getFilters (): Filters {
    return this._filters
  }

  public initFromUsed (usedFilters: UsedFilters, count: number): void {
    // disable valueChanged() upon f.initFromUsed()
    this._disableUpdates = true
    Object.values(this._filters).forEach(f => f.initFromUsed(usedFilters))
    this._disableUpdates = false

    // push to query source here since updates are disabled in valueChanged()
    this.pushToQuerySource()

    if (this._historyKey && !count) {
      filterHistory.removeFilters(this._historyKey)
    }
  }

  public querySourceChanged (): void {
    const query = this._querySource.getQuery()

    if (JSON.stringify(this._lastQuery) === JSON.stringify(query)) {
      return
    }

    this.initFromQuerySource()

    this.dispatchUpdate()
  }

  public valueChanged (filters: Filters): void {
    // update events are disabled if initialized from used filters
    if (this._disableUpdates) {
      return
    }

    // reset page filter if any filter changes
    if (!Object.values(filters).find(f => f instanceof PageFilter)) {
      const pageFilter = Object.values(this._filters).find(f => f instanceof PageFilter)
      if (pageFilter) {
        pageFilter.reset()
      }
    }

    this.pushToQuerySource()

    this.dispatchUpdate()
  }

  public reset (): void {
    const changedFilters: Filters = {}
    Object.values(this._filters).forEach(f => {
      const changed = f.reset()
      if (changed) {
        changedFilters[f.name] = f
      }
    })
    this.pushToQuerySource()

    this.valueChanged(changedFilters)
  }

  public serialize (options: {} = {}): UsedFilters {
    return Object.values(this._filters).reduce((map: UsedFilters, filter: Filter) => {
      return {
        ...map,
        ...filter.serialize()
      }
    }, options)
  }

  private dispatchUpdate (): void {
    this._eventTarget.dispatchEvent(new FilterChangeEvent('change', {}))
  }

  private initFromQuerySource (): void {
    const query = this._querySource.getQuery()

    for (const filter of Object.values(this._filters)) {
      filter.initFromQuerySource(query)
    }

    this._lastQuery = query
  }

  private pushToQuerySource (): void {
    const query = Object.values(this._filters).reduce((map: QuerySource, filter: Filter) => {
      return {
        ...map,
        ...filter.toQuerySource()
      }
    }, {})

    this._querySource.push(query)

    this._lastQuery = query
  }
}
