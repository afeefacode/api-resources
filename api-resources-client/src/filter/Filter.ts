import { Query } from './BaseQuerySource'
import { RequestFilters } from './RequestFilters'

export type FilterJSON = {
  type: string,
  params: FilterParams,
  default: unknown
}

export type FilterParams = {
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
  public defaultValue: unknown
  public value: unknown

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
        set: function (filter: Filter, key: string, value: unknown): boolean {
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

  public initFromUsed (usedFilters: Query): void {
    if (usedFilters[this.name]) {
      if (this.defaultValue && typeof this.defaultValue === 'object') {
        for (const [key, value] of Object.entries(usedFilters[this.name])) {
          (this.value as Record<string, unknown>)[key] = value
        }
      } else {
        this.value = usedFilters[this.name]
      }
    }
  }

  public initFromQuerySource (query: Query): void {
    if (query[this.name]) {
      this.fromQuerySource(query)
    } else {
      this.reset()
    }
  }

  protected fromQuerySource (query: Query): void {
    this.value = query[this.name]
  }

  public toUrlParams (): Query {
    return this.toQuerySource()
  }

  public toQuerySource (): Query {
    if (this.value) {
      return {
        [this.name]: this.value
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

  public serialize (): Query {
    if (this.value) {
      return {
        [this.name]: this.value
      }
    }

    return {}
  }

  protected init (name: string, defaultValue: unknown, params: unknown): void {
    this.name = name
    this.defaultValue = defaultValue
    this.params = params
  }

  protected createValueProxy (defaultValue: object): object {
    const value = new Proxy({
      ...defaultValue
    }, {
      get: function (object: Record<string, unknown>, key: string): unknown {
        return object[key]
      },
      set: (object: Record<string, unknown>, key: string, value: unknown): boolean => {
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

  protected valueChanged (key: string, value: unknown): void {
    // console.log('--- value changed', this.constructor.name, this.name, key, value)
    this._requestFilters.valueChanged(this)
  }
}
