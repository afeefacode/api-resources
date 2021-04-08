import { Action, ActionJSON } from '../action/Action'

export type ResourceJSON = Record<string, ActionJSON>

export class Resource {
  private _actions: Action[] = []

  constructor (json: ResourceJSON) {
    for (const [name, actionJSON] of Object.entries(json)) {
      const action = new Action(name, actionJSON)
      this._actions.push(action)
    }
  }
}
