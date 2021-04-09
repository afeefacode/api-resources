import { apiResources } from '../ApiResources'
import { Filter, FilterJSON } from '../filter/Filter'
import { ActionInput } from './ActionInput'
import { ActionParam, ActionParamJSON } from './ActionParams'
import { ActionResponse } from './ActionResponse'

export type ActionJSON = {
  params: Record<string, ActionParamJSON>,
  filters: Record<string, FilterJSON>,
  input: {
    type: string
  },
  response: {
    type: string
  },
}

export class Action {
  private _name: string
  private _response: ActionResponse | null = null
  private _params: Record<string, ActionParam> = {}
  private _input: ActionInput | null = null
  private _filters: Record<string, Filter> = {}

  constructor (name: string, json: ActionJSON) {
    this._name = name

    if (json.response) {
      this._response = new ActionResponse(json.response.type)
    }

    if (json.input) {
      this._input = new ActionInput(json.input.type)
    }

    if (json.params) {
      for (const [name, paramJSON] of Object.entries(json.params)) {
        const param = new ActionParam(paramJSON)
        this._params[name] = param
      }
    }

    if (json.filters) {
      for (const [name, filterJSON] of Object.entries(json.filters)) {
        const FilterClass = apiResources.getFilter(filterJSON.type)
        if (FilterClass) {
          const filter = new FilterClass(filterJSON)
          this._filters[name] = filter
        }
      }
    }
  }
}
