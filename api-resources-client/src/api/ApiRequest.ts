import axios, { AxiosError } from 'axios'

import { Action } from '../action/Action'
import { BagEntries } from '../bag/Bag'
import { ActionFilterValueType } from '../filter/ActionFilter'
import { ApiError } from './ApiError'
import { ApiResponse } from './ApiResponse'

export type ApiRequestJSON = {
  api?: string,
  resource: string
  action: string
  params?: Record<string, unknown>
  filters?: BagEntries<ActionFilterValueType>
  fields?: Record<string, unknown>
  data?: Record<string, unknown>
}

export class ApiRequest {
  private _action!: Action
  private _fields!: Record<string, unknown>
  private _params!: Record<string, unknown>
  private _filters!: BagEntries<ActionFilterValueType>
  private _data!: Record<string, unknown>

  // private _lastRequestJSON: string = ''
  // private _lastRequest!: Promise<ApiResponse | boolean>

  constructor (json?: ApiRequestJSON) {
    if (json) {
      if (json.params) {
        this._params = json.params
      }

      if (json.filters) {
        this._filters = json.filters
      }

      if (json.fields) {
        this._fields = json.fields
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

  public params (params: Record<string, unknown>): ApiRequest {
    this._params = params
    return this
  }

  public addParam (name: string, value: unknown): ApiRequest {
    this.params(this._params || {})
    this._params[name] = value
    return this
  }

  public addParams (params: Record<string, unknown>): ApiRequest {
    this._params = {
      ...(this._params || {}),
      ...params
    }
    return this
  }

  public getParams (): Record<string, unknown> {
    return this._params
  }

  public fields (fields: Record<string, unknown>): ApiRequest {
    this._fields = fields
    return this
  }

  public addField (name: string, value: unknown): ApiRequest {
    this.fields(this._fields || {})
    this._fields[name] = value
    return this
  }

  public getFields (): Record<string, unknown> {
    return this._fields
  }

  public filters (filters: BagEntries<ActionFilterValueType>): ApiRequest {
    this._filters = filters
    return this
  }

  public addFilter (name: string, value: ActionFilterValueType): ApiRequest {
    this.filters(this._filters || {})
    this._filters[name] = value
    return this
  }

  public addFilters (filters: BagEntries<ActionFilterValueType>): ApiRequest {
    this._filters = {
      ...(this._filters || {}),
      ...filters
    }
    return this
  }

  public getFilters (): BagEntries<ActionFilterValueType> {
    return this._filters
  }

  public data (data: Record<string, unknown>): ApiRequest {
    this._data = data
    return this
  }

  public send (): Promise<ApiResponse | ApiError> {
    const params = this.serialize()

    const urlResourceType = this._action.getResource().getType().replace(/.+\./, '').replace(/Resource/, '')

    let url = this._action.getApi().getBaseUrl() + '?' + urlResourceType + ':' + this._action.getName()

    if (this._params && this._params.id) {
      url += ':' + (this._params.id as string)
    }

    if (this._fields) {
      url += ':' + (Object.keys(this._fields).join(','))
    }

    const axiosResponse = axios.post(url, params)
      .then(result => {
        return new ApiResponse(this, result)
      })
      .catch((error: AxiosError) => {
        console.error(error)
        return new ApiError(this, error)
      })

    // this._lastRequest = request
    return axiosResponse
  }

  protected serialize (): object {
    const json: ApiRequestJSON = {
      resource: this._action.getResource().getType(),
      action: this._action.getName()
    }

    if (this._fields) {
      json.fields = this._fields
    }

    if (this._params) {
      json.params = this._params
    }

    if (this._filters) {
      json.filters = this._filters
    }

    if (this._data || this._data === null) {
      json.data = this._data
    }

    return json
  }
}
