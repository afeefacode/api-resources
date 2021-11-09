import { Api } from '../api/Api'
import { ApiRequest } from '../api/ApiRequest'
import { BatchApiRequest } from '../api/BatchApiRequest'
import { apiResources } from '../ApiResources'
import { ActionFilterJSON } from '../filter/ActionFilter'
import { ActionFilterBag } from '../filter/ActionFilterBag'
import { Resource } from '../resource/Resource'
import { ActionInput } from './ActionInput'
import { ActionParam, ActionParamJSON } from './ActionParams'
import { ActionResponse } from './ActionResponse'

export type ActionJSON = {
  params: Record<string, ActionParamJSON>
  filters: Record<string, ActionFilterJSON>
  input: {
    type: string
  }
  response: {
    type: string
  }
}

export class Action {
  private _resource: Resource
  private _name: string
  private _response: ActionResponse | null = null
  private _params: Record<string, ActionParam> = {}
  private _input: ActionInput | null = null
  private _filters: ActionFilterBag = new ActionFilterBag()

  constructor (resource: Resource, name: string, json: ActionJSON) {
    this._resource = resource
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
      for (const [name, actionFilterJSON] of Object.entries(json.filters)) {
        const filter = apiResources.getFilter(actionFilterJSON.type)
        if (filter) {
          const actionFilter = filter.createActionFilter(this, name, actionFilterJSON)
          this._filters.add(name, actionFilter)
        }
      }
    }
  }

  public getName (): string {
    return this._name
  }

  public getFullName (): string {
    return this.getResource().getType() + '.' + this._name
  }

  public getResponse (): ActionResponse | null {
    return this._response
  }

  public getInput (): ActionInput | null {
    return this._input
  }

  public getFilters (): ActionFilterBag {
    return this._filters
  }

  public createRequest (): ApiRequest {
    return new ApiRequest()
      .action(this)
  }

  public batchRequest (): BatchApiRequest {
    return new BatchApiRequest()
      .action(this)
  }

  public getResource (): Resource {
    return this._resource
  }

  public getApi (): Api {
    return this._resource.getApi()
  }
}
