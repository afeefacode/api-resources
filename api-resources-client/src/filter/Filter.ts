import { QuerySource } from './BaseQuerySource'
import { RequestFilters } from './RequestFilters'

export type FilterJSON = {
  type: string,
  params: FilterParams,
  default: FilterValue
}

export type FilterParams = object

export type FilterValue = boolean | string | number | null | FilterValues

export type FilterValues = {
  [key: string]: FilterValue
}

type FilterConstructor = {
  new (requestFilters?: RequestFilters): Filter,
  type: string,
}

export class Filter {
  [key: string]: any;

  public type!: string
  public name!: string

  public params: unknown

  public defaultValue!: FilterValue
  public value!: FilterValue

  private _valueInitialized: boolean = false
  private _requestFilters!: RequestFilters

  constructor (requestFilters?: RequestFilters) {
    this.type = (this.constructor as FilterConstructor).type
    // console.log('--REG--', this.type, this.constructor.name)

    if (requestFilters) {
      this._requestFilters = requestFilters

      return new Proxy<Filter>(this, {
        get: function (filter: Filter, key: string): unknown {
          return filter[key]
        },
        set: function (filter: Filter, key: string, value: FilterValue): boolean {
          // ignore setting initial value in constructor where
          // name is not present yet
          if (filter._valueInitialized && key === 'value') {
            const oldJson = filter.serialize()
            // console.log('setFilterValue1', filter.constructor.name, filter.name, key, value, filter.value, filter[key])
            filter[key] = value
            const newJson = filter.serialize()
            if (JSON.stringify(newJson) !== JSON.stringify(oldJson)) {
              // console.log('setFilterValue', filter.constructor.name, filter.name, key, value)
              // console.log(JSON.stringify(oldJson), JSON.stringify(newJson))
              filter.valueChanged(key, value)
            }
          } else {
            filter[key] = value
          }
          return true
        }
      })
    }
  }

  public createActionFilter (name: string, json: FilterJSON): Filter {
    const filter = new (this.constructor as FilterConstructor)()
    filter.init(name, json.default, json.params)
    return filter
  }

  public createRequestFilter (requestFilters: RequestFilters): Filter {
    const filter = new (this.constructor as FilterConstructor)(requestFilters)
    filter.init(this.name, this.defaultValue, this.params)
    filter.reset()
    return filter
  }

  public initFromUsed (usedFilters: FilterValues): void {
    const usedFilter = usedFilters[this.name]
    if (usedFilter) {
      if (typeof usedFilter === 'object') {
        // const usedFilter: FilterValues = usedFilters[this.name] as FilterValues
        for (const [key, value] of Object.entries(usedFilter)) {
          (this.value as FilterValues)[key] = value
        }
      } else {
        this.value = usedFilter
      }
    }
  }

  public initFromQuerySource (query: QuerySource): void {
    if (query[this.name]) {
      this.fromQuerySource(query)
    } else {
      this.reset()
    }
  }

  public toUrlParams (): QuerySource {
    return this.toQuerySource()
  }

  public toQuerySource (): QuerySource {
    if (this.value && typeof this.value === 'object') {
      const query: QuerySource = {}
      for (const [key, value] of Object.entries(this.value)) {
        if (value !== (this.defaultValue as FilterValues)[key]) {
          const valueString = this.filterValueToString(value)
          if (valueString) {
            query[key] = valueString
          }
        }
      }
      return query
    } else {
      if (this.value !== this.defaultValue) {
        const valueString = this.filterValueToString(this.value)
        if (valueString) {
          return {
            [this.name]: valueString
          }
        }
      }
    }
    return {}
  }

  public reset (): void {
    if (this.defaultValue && typeof this.defaultValue === 'object') {
      this.value = this.createValueProxy(this.defaultValue)
    } else {
      this.value = this.defaultValue
    }
    this._valueInitialized = true
  }

  public serialize (): FilterValues {
    if (this.value) {
      return {
        [this.name]: this.value
      }
    }

    return {}
  }

  protected fromQuerySource (query: QuerySource): void {
    const queryValue = query[this.name]
    if (queryValue) {
      this.value = queryValue as FilterValue
    } else {
      this.value = null
    }
  }

  protected filterValueToString (value: FilterValue): string | null {
    switch (typeof value) {
      case 'boolean':
        return value ? '1' : '0'
      case 'number':
        return value.toString()
      case 'string':
        return value
    }
    return null
  }

  protected init (name: string, defaultValue: FilterValue, params: unknown): void {
    this.name = name
    this.defaultValue = defaultValue
    this.params = params
  }

  protected createValueProxy (defaultValue: FilterValue): FilterValue {
    const value = new Proxy({
      ...(defaultValue as object)
    }, {
      get: function (object: FilterValues, key: string): unknown {
        return object[key]
      },
      set: (object: FilterValues, key: string, value: FilterValue): boolean => {
        // console.log('setFilterValueProp', this.constructor.name, this.name, key, value)
        if (value !== object[key]) {
          // console.log('setFilterValueProp', this.constructor.name, this.name, key, value)
          object[key] = value
          this.valueChanged(key, object)
        }
        return true
      }
    })

    return value
  }

  protected valueChanged (_key: string, _value: unknown): void {
    // console.log('--- value changed', this.constructor.name, this.name, key, value)
    this._requestFilters.valueChanged(this)
  }
}
