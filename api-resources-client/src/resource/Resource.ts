import { Action, ActionJSON } from '../action/Action'
import { Api } from '../api/Api'

export type ResourceJSON = Record<string, ActionJSON>

export class Resource {
  private _api: Api
  private _type: string
  private _actions: Record<string, Action> = {}

  constructor (api: Api, name: string, json: ResourceJSON) {
    this._api = api
    this._type = name

    for (const [name, actionJSON] of Object.entries(json)) {
      const action = new Action(this, name, actionJSON)
      this._actions[name] = action
    }
  }

  public getApi (): Api {
    return this._api
  }

  public getType (): string {
    return this._type
  }

  public getAction (name: string): Action | null {
    if (!this._actions[name]) {
      console.warn(`No action '${name}' configured for resource '${this._type}'.`)
      return null
    }
    return this._actions[name]!
  }
}
