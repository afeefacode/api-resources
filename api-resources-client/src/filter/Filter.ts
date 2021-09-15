import { Action } from '../action/Action'
import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest'
import { QuerySource } from './BaseFilterSource'
import { RequestFilters, UsedFilters } from './RequestFilters'

export type FilterValueType = boolean | string | number | [string, FilterValueType] | null

export type FilterJSON = {
  type: string
  default: FilterValueType
  options: []
  optionsRequest: ApiRequestJSON
}

export type FilterParams = object

type FilterConstructor = {
  new (requestFilters?: RequestFilters): Filter
  type: string
}

type RequestFactory = (() => ApiRequest) | null

export class Filter {
  public type!: string
  public name!: string

  private _action!: Action
  private _defaultValue!: FilterValueType
  private _value!: FilterValueType
  public options: unknown[] = []
  private _requestFactory: RequestFactory = null
  private _request: ApiRequest | null = null

  private _requestFilters!: RequestFilters

  constructor (requestFilters?: RequestFilters) {
    this.type = (this.constructor as FilterConstructor).type

    if (requestFilters) {
      this._requestFilters = requestFilters
    }
  }

  public getAction (): Action {
    return this._action
  }

  public get value (): FilterValueType {
    return this._value
  }

  public set value (value: FilterValueType) {
    if (value !== this._value) {
      this._value = value
      this._requestFilters.valueChanged({
        [this.name]: this
      })
    }
  }

  public get defaultValue (): FilterValueType {
    return this._defaultValue
  }

  public get request (): ApiRequest | null {
    return this._request
  }

  public createActionFilter (action: Action, name: string, json: FilterJSON): Filter {
    const filter = new (this.constructor as FilterConstructor)()

    let requestFactory: RequestFactory = null
    if (json.optionsRequest) {
      requestFactory = (): ApiRequest => {
        const requestAction = action.getApi().getAction(json.optionsRequest.resource, json.optionsRequest.action)
        return new ApiRequest(json.optionsRequest)
          .action(requestAction as Action)
      }
    }

    filter.init(action, name, json.default || null, json.options, requestFactory)
    return filter
  }

  public createRequestFilter (requestFilters: RequestFilters): Filter {
    const filter = new (this.constructor as FilterConstructor)(requestFilters)
    filter.init(this._action, this.name, this._defaultValue, this.options, this._requestFactory)
    if (filter._requestFactory) {
      filter._request = filter._requestFactory()
    }
    filter.reset()
    return filter
  }

  public initFromUsed (usedFilters: UsedFilters): void {
    const usedFilter = usedFilters[this.name]
    if (usedFilter !== undefined) {
      this.value = usedFilter
    }
  }

  public initFromQuerySource (query: QuerySource): void {
    const queryValue = query[this.name]
    if (queryValue) {
      this._value = this.queryToValue(queryValue) as FilterValueType
    } else {
      this.reset()
    }
  }

  public toQuerySource (): QuerySource {
    if (!this.hasDefaultValueSet()) {
      const valueString = this.valueToQuery(this._value)
      if (valueString) {
        return {
          [this.name]: valueString
        }
      }
    }

    return {}
  }

  public hasDefaultValueSet (): boolean {
    return JSON.stringify(this._value) === JSON.stringify(this._defaultValue)
  }

  public reset (): boolean {
    if (!this.hasDefaultValueSet()) {
      this._value = this._defaultValue
      return true
    }
    return false
  }

  public serialize (): UsedFilters {
    if (!this.hasDefaultValueSet()) {
      const serialized = this.serializeValue(this._value)
      if (serialized !== undefined) {
        return {
          [this.name]: this._value
        }
      }
    }
    return {}
  }

  protected valueToQuery (_value: unknown): string | undefined {
    return undefined
  }

  protected queryToValue (_value: string): unknown | undefined {
    return undefined
  }

  protected serializeValue (value: unknown): unknown | undefined {
    return value
  }

  protected init (action: Action, name: string, defaultValue: FilterValueType, options: unknown[] = [], _requestFactory: RequestFactory): void {
    this._action = action
    this.name = name
    this._defaultValue = defaultValue
    this.options = options
    this._requestFactory = _requestFactory
  }
}
