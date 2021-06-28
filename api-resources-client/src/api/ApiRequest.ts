import axios from 'axios'

import { Action } from '../action/Action'
import { ApiResponse } from './ApiResponse'

export type ApiRequestJSON = {
  resource: string
  action: string
  scopes: Record<string, unknown>
  filters: Record<string, unknown>
  fields: Record<string, unknown>
  params: Record<string, unknown>
}

export class ApiRequest {
  private _action!: Action
  private _fields: Record<string, unknown> = {}
  private _scopes!: Record<string, unknown>
  private _filters!: Record<string, unknown>
  private _params!: Record<string, unknown>
  private _data!: Record<string, unknown>

  // private _lastRequestJSON: string = ''
  // private _lastRequest!: Promise<ApiResponse | boolean>

  constructor (json?: ApiRequestJSON) {
    if (json) {
      this._fields = json.fields

      if (json.scopes) {
        this._scopes = json.scopes
      }

      if (json.filters) {
        this._filters = json.filters
      }

      if (json.params) {
        this._params = json.params
      }
    }
  }

  public action (action: Action): ApiRequest {
    this._action = action
    return this
  }

  public getAction (): Action {
    return this._action
  }

  public fields (fields: Record<string, unknown>): ApiRequest {
    this._fields = fields
    return this
  }

  public addField (name: string, value: unknown): ApiRequest {
    this._fields[name] = value
    return this
  }

  public scopes (scopes: Record<string, unknown>): ApiRequest {
    this._scopes = scopes
    return this
  }

  public filters (filters: Record<string, unknown>): ApiRequest {
    this._filters = filters
    return this
  }

  public params (params: Record<string, unknown>): ApiRequest {
    this._params = params
    return this
  }

  public data (data: Record<string, unknown>): ApiRequest {
    this._data = data
    return this
  }

  public send (): Promise<ApiResponse | boolean> {
    const params = this.serialize()

    // if (this._lastRequestJSON === JSON.stringify(params)) {
    //   return this._lastRequest
    // }

    // this._lastRequestJSON = JSON.stringify(params)

    const urlResourceType = this._action.getResource().getName().replace(/.+\./, '').replace(/Resource/, '')
    let url = this._action.getApi().getBaseUrl() + '?' + urlResourceType + ':' + this._action.getName()
    if (this._params && this._params.id) {
      url += ':' + (this._params.id as string)
    }

    const axiosResponse = axios.post(url, params)
      .then(result => {
        return new ApiResponse(new ApiRequest(), result)
      })
      .catch((error) => {
        console.error(error)
        return false
      })

    // this._lastRequest = request
    return axiosResponse
  }

  protected serialize (): object {
    return {
      resource: this._action.getResource().getName(),
      action: this._action.getName(),
      params: this._params,
      scopes: this._scopes,
      filters: this._filters,
      fields: this._fields,
      data: this._data
    }
  }
}
