import { Action } from 'src/action/Action'

export class ApiRequest {
  private _action!: Action
  private _fields: object = {}
  private _filters: object = {}

  public action (action: Action): ApiRequest {
    this._action = action
    return this
  }

  public fields (fields: object): ApiRequest {
    this._fields = fields
    return this
  }

  public filters (filters: object): ApiRequest {
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
