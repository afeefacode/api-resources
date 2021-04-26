import { Action, ActionJSON } from '../action/Action'
import { Api } from '../api/Api'

export type ResourceJSON = Record<string, ActionJSON>

export class Resource {
  private _api: Api
  private _name: string
  private _actions: Record<string, Action> = {}

  constructor (api: Api, name: string, json: ResourceJSON) {
    this._api = api
    this._name = name

    for (const [name, actionJSON] of Object.entries(json)) {
      const action = new Action(this, name, actionJSON)
      this._actions[name] = action
    }
  }

  public getApi (): Api {
    return this._api
  }

  public getName (): string {
    return this._name
  }

  public getAction (name: string): Action | null {
    return this._actions[name] || null
  }
}
