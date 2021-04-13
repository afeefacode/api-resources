import { BaseQuerySource, QuerySource } from './BaseQuerySource'
import { Filter, FilterValues } from './Filter'
import { FilterChangeEvent } from './FilterChangeEvent'
import { ObjectQuerySource } from './ObjectQuerySource'

export class RequestFilters {
  private _filters: Record<string, Filter> = {}
  private _querySource: BaseQuerySource

  private _lastQuery: Query = {}
  private _disableUpdates: boolean = false

  private _eventTarget: EventTarget = new EventTarget()

  constructor (querySource?: BaseQuerySource) {
    this._querySource = querySource || new ObjectQuerySource({})
  }

  public querySource (querySource: BaseQuerySource): void {
    this._querySource = querySource
  }

  public add (name: string, filter: Filter): void {
    this._filters[name] = filter
  }

  public getFilters (): Record<string, Filter> {
    return this._filters
  }

  public getQuerySource (): BaseQuerySource {
    return this._querySource
  }

  public initFromUsed (usedFilters: FilterValues): void {
    this._disableUpdates = true
    Object.values(this._filters).forEach(f => f.initFromUsed(usedFilters))
    this._disableUpdates = false
    this.pushToQuerySource()
  }

  public on (type: string, handler: () => {}): void {
    this._eventTarget.addEventListener(type, handler)
  }

  public off (type: string, handler: () => {}): void {
    this._eventTarget.removeEventListener(type, handler)
  }

  public valueChanged (filter: Filter): void {
    if (this._disableUpdates) {
      return
    }
    this._eventTarget.dispatchEvent(new FilterChangeEvent('change', filter))
  }

  public initFromQuerySource (): boolean {
    const query = this._querySource.getQuery()

    // no initial filters
    if (JSON.stringify(this._lastQuery) === JSON.stringify(query)) {
      console.warn('same query')
      return false
    }

    console.log(JSON.stringify(this._lastQuery), JSON.stringify(query))

    for (const filter of Object.values(this._filters)) {
      filter.initFromQuerySource(query)
    }

    this._lastQuery = query

    return true
  }

  public pushToQuerySource (): void {
    const query = Object.values(this._filters).reduce((map: QuerySource, filter: Filter) => {
      return {
        ...map,
        ...filter.toUrlParams()
      }
    }, {})

    this._querySource.push(query)

    this._lastQuery = query
  }

  public resetFilters (): void {
    Object.values(this._filters).forEach(f => {
      f.reset()
    })
    this.pushToQuerySource()
  }

  public serialize (): FilterValues {
    return Object.values(this._filters).reduce((map: FilterValues, filter: Filter) => {
      return {
        ...map,
        ...filter.serialize()
      }
    }, {})
  }
}
