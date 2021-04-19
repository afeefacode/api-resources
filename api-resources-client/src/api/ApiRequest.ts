import { AxiosResponse } from 'axios'
import { Action } from '../action/Action'

export type ApiRequestJSON = {
  resource: string,
  action: string,
  fields: Record<string, unknown>,
  filters: Record<string, unknown>
}

export class ApiRequest {
  private _action!: Action
  private _fields!: Record<string, unknown>
  private _filters!: Record<string, unknown>

  private _lastRequestJSON: string = ''
  private _lastRequest!: Promise<AxiosResponse>

  constructor (json?: ApiRequestJSON) {
    if (json) {
      this._fields = json.fields

      if (json.filters) {
        this._filters = json.filters
      }
    }
  }

  public action (action: Action): ApiRequest {
    this._action = action
    return this
  }

  public fields (fields: Record<string, unknown>): ApiRequest {
    this._fields = fields
    return this
  }

  public filters (filters: Record<string, unknown>): ApiRequest {
    this._filters = filters
    return this
  }

  public send (): Promise<AxiosResponse> {
    const params = this.toParams()

    if (this._lastRequestJSON === JSON.stringify(params)) {
      return this._lastRequest
    }

    this._lastRequestJSON = JSON.stringify(params)

    const api = this._action.getApi()
    this._lastRequest = api.call(params)
    return this._lastRequest
  }

  protected toParams (): object {
    return {
      resource: this._action.getResource().getName(),
      action: this._action.getName(),
      fields: this._fields,
      filters: this._filters
    }
  }
}
