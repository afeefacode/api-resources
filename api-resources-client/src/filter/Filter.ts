import { Action } from '../action/Action'
import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest'
import { BagEntries } from '../bag/Bag'
import { RequestFilters } from './RequestFilters'

export type FilterValueType = (
  boolean | string | number | null |
  Record<string, boolean | string | number | null>
)

export type FilterJSON = {
  type: string
  default: FilterValueType
  options: []
  options_request: ApiRequestJSON
  null_is_option: boolean
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
  private _defaultValue: FilterValueType = null
  private _nullIsOption: boolean = false
  private _value: FilterValueType = null
  private _options: unknown[] = []
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

  /**
   * Sets the filter value and dispatches a change event
   */
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

  public hasOptions (): boolean {
    return !!this._options.length
  }

  public hasOption (value: unknown): boolean {
    return this._options.includes(value)
  }

  public get options (): unknown[] {
    return this._options
  }

  public get nullIsOption (): boolean {
    return this._nullIsOption
  }

  public hasRequest (): boolean {
    return !!this._requestFactory
  }

  public get request (): ApiRequest | null {
    if (this._requestFactory) {
      return this._requestFactory()
    }
    return null
  }

  public createActionFilter (action: Action, name: string, json: FilterJSON): Filter {
    const filter = new (this.constructor as FilterConstructor)()

    let requestFactory: RequestFactory = null
    if (json.options_request) {
      requestFactory = (): ApiRequest => {
        const requestAction = action.getApi().getAction(json.options_request.resource, json.options_request.action)
        return new ApiRequest(json.options_request)
          .action(requestAction as Action)
      }
    }

    filter.init(
      action,
      name,
      json.default || null,
      json.options || [],
      json.null_is_option || false,
      requestFactory
    )
    return filter
  }

  public createRequestFilter (requestFilters: RequestFilters): Filter {
    const filter = new (this.constructor as FilterConstructor)(requestFilters)
    filter.init(
      this._action,
      this.name,
      this._defaultValue,
      this._options,
      this._nullIsOption,
      this._requestFactory
    )
    if (filter._requestFactory) {
      filter._request = filter._requestFactory()
    }
    filter.reset()
    return filter
  }

  public initFromUsed (usedFilters: BagEntries<FilterValueType>): void {
    const usedFilter = usedFilters[this.name]
    if (usedFilter !== undefined) {
      this._value = usedFilter
    } else {
      this.reset()
    }
  }

  public initFromQuerySource (query: BagEntries<string>): void {
    const queryValue = query[this.name]
    if (queryValue) { // has query value, typeof === string
      const value = this.queryToValue(queryValue) // query value valid
      if (value !== undefined) {
        this._value = value
        return
      }
    }
    this.reset() // reset to default
  }

  public toQuerySource (): BagEntries<string> {
    if (!this.hasDefaultValueSet()) {
      const valueString = this.valueToQuery(this._value) // value can be represented in query
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

  public serialize (): BagEntries<FilterValueType> {
    if (!this.hasDefaultValueSet()) { // send only if no default
      let useFilter = true
      if (this._value === null) { // send null only if it's an option
        useFilter = this._nullIsOption
      }
      if (useFilter) {
        return {
          [this.name]: this.serializeValue(this._value)
        }
      }
    }
    return {}
  }

  /**
   * Serializes a filter value into a stringified query value
   */
  public valueToQuery (_value: FilterValueType): string | undefined {
    return undefined
  }

  /**
   * Converts a stringified query value into a valid filter value
   */
  public queryToValue (_value: string): FilterValueType | undefined {
    return undefined
  }

  /**
   * Converts a filter value into a serialized form to be used in api requests
   */
  public serializeValue (value: FilterValueType): FilterValueType {
    return value
  }

  protected init (
    action: Action,
    name: string,
    defaultValue: FilterValueType,
    options: unknown[],
    nullIsOption: boolean,
    _requestFactory: RequestFactory
  ): void {
    this._action = action
    this.name = name
    this._defaultValue = defaultValue
    this._options = options
    this._nullIsOption = nullIsOption
    this._requestFactory = _requestFactory
  }
}
