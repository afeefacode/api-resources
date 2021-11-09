import { Action } from '../action/Action'
import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest'

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
  new (): Filter
  type: string
}

type RequestFactory = (() => ApiRequest) | null

export class Filter {
  public type!: string
  public name!: string

  private _action!: Action
  private _defaultValue: FilterValueType = null
  private _nullIsOption: boolean = false
  private _options: unknown[] = []
  private _requestFactory: RequestFactory = null

  constructor () {
    this.type = (this.constructor as FilterConstructor).type
  }

  public getAction (): Action {
    return this._action
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
