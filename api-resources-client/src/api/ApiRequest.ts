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

  public send (): Promise<any> {
    const api = this._action.getApi()
    return api.call(this.toParams())
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
