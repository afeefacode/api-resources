import { Api } from '../api/Api'
import { ApiRequest } from '../api/ApiRequest'
import { apiResources } from '../ApiResources'
import { BaseFilterSource } from '../filter/BaseFilterSource'
import { Filter, FilterJSON } from '../filter/Filter'
import { RequestFilters } from '../filter/RequestFilters'
import { Resource } from '../resource/Resource'
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

export type ActionFilters = Record<string, Filter>

export class Action {
  private _resource: Resource
  private _name: string
  private _response: ActionResponse | null = null
  private _params: Record<string, ActionParam> = {}
  private _input: ActionInput | null = null
  private _filters: ActionFilters = {}

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
      for (const [name, filterJSON] of Object.entries(json.filters)) {
        const filter = apiResources.getFilter(filterJSON.type)
        if (filter) {
          const actionFilter = filter.createActionFilter(this, name, filterJSON)
          this._filters[name] = actionFilter
        }
      }
    }
  }

  public getName (): string {
    return this._name
  }

  public getFilters (): ActionFilters {
    return this._filters
  }

  public createRequestFilters (historyKey?: string, querySource?: BaseFilterSource): RequestFilters {
    return RequestFilters.create(this._filters, historyKey, querySource)
  }

  public request (): ApiRequest {
    return new ApiRequest()
      .action(this)
  }

  public getResource (): Resource {
    return this._resource
  }

  public getApi (): Api {
    return this._resource.getApi()
  }
}
