import { Action } from '../action/Action'
import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest'
import { Filter } from './Filter'

export type ActionFilterValueType = (
  boolean | string | number | null |
  Record<string, boolean | string | number | null>
)

export type ActionFilterJSON = {
  type: string
  default: ActionFilterValueType
  options: []
  options_request: ApiRequestJSON
  null_is_option: boolean
}

type RequestFactory = (() => ApiRequest) | null

export class ActionFilter {
  private _filter: Filter
  private _name: string
  private _defaultValue: ActionFilterValueType = null
  private _nullIsOption: boolean = false
  private _options: unknown[] = []
  private _requestFactory: RequestFactory = null

  constructor (action: Action, filter: Filter, name: string, json: ActionFilterJSON) {
    this._filter = filter
    this._name = name
    this._defaultValue = json.default || null
    this._options = json.options || []
    this._nullIsOption = json.null_is_option || false

    if (json.options_request) {
      this._requestFactory = (): ApiRequest => {
        const requestAction = action.getApi().getAction(json.options_request.resource, json.options_request.action)
        return new ApiRequest(json.options_request)
          .action(requestAction as Action)
      }
    }
  }

  public get type (): string {
    return this._filter.type
  }

  public get name (): string {
    return this._name
  }

  public get defaultValue (): ActionFilterValueType {
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

  public hasOptionsRequest (): boolean {
    return !!this._requestFactory
  }

  public createOptionsRequest (): ApiRequest | null {
    if (this._requestFactory) {
      return this._requestFactory()
    }
    return null
  }

  public valueToQuery (value: ActionFilterValueType): string | undefined {
    return this._filter.valueToQuery(value)
  }

  public queryToValue (value: string): ActionFilterValueType | undefined {
    return this._filter.queryToValue(value)
  }

  public serializeValue (value: ActionFilterValueType): ActionFilterValueType {
    return value
  }
}
