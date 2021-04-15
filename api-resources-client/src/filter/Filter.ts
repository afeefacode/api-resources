import { QuerySource } from './BaseQuerySource'
import { RequestFilters } from './RequestFilters'

export type FilterValueType = boolean | string | number | [string, FilterValueType] | null

export type FilterJSON = {
  type: string,
  default: FilterValueType,
  options: []
}

export type FilterParams = object

type FilterConstructor = {
  new (requestFilters?: RequestFilters): Filter,
  type: string,
}

export class Filter {
  public type!: string
  public name!: string

  private _defaultValue!: FilterValueType
  private _value!: FilterValueType
  public options!: unknown[] = []

  private _requestFilters!: RequestFilters

  constructor (requestFilters?: RequestFilters) {
    this.type = (this.constructor as FilterConstructor).type

    if (requestFilters) {
      this._requestFilters = requestFilters
    }
  }

  public get value (): FilterValueType {
    return this._value
  }

  public set value (value: FilterValueType) {
    if (value !== this._value) {
      this._value = value
      this._requestFilters.valueChanged(this)
    }
  }

  public createActionFilter (name: string, json: FilterJSON): Filter {
    const filter = new (this.constructor as FilterConstructor)()
    filter.init(name, json.default || null, json.options)
    return filter
  }

  public createRequestFilter (requestFilters: RequestFilters): Filter {
    const filter = new (this.constructor as FilterConstructor)(requestFilters)
    filter.init(this.name, this._defaultValue, this.options)
    filter.reset()
    return filter
  }

  public initFromUsed (usedFilters: Record<string, FilterValueType>): void {
    const usedFilter = usedFilters[this.name]
    if (usedFilter) {
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
    if (this._value !== this._defaultValue) {
      const valueString = this.valueToQuery(this._value)
      if (valueString) {
        return {
          [this.name]: valueString
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

  public reset (): void {
    this._value = this._defaultValue
  }

  public serialize (): Record<string, FilterValueType> {
    if (this._value !== this._defaultValue) {
      const serialized = this.serializeValue(this._value)
      if (serialized !== undefined) {
        return {
          [this.name]: this._value
        }
      }
    }
    return {}
  }

  protected serializeValue (value: unknown): unknown | undefined {
    return value
  }

  protected init (name: string, defaultValue: FilterValueType, options: unknown[] = []): void {
    this.name = name
    this._defaultValue = defaultValue
    this.options = options
  }
}
