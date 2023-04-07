import { CancelTokenSource } from 'axios'

import { Action } from '../action/Action'
import { apiResources } from '../ApiResources'
import { BagEntries } from '../bag/Bag'
import { ActionFilterValueType } from '../filter/ActionFilter'
import { Model } from '../Model'
import { ApiError } from './ApiError'
import { ApiRequest } from './ApiRequest'
import { ApiResponse } from './ApiResponse'

type ApiListActionResponse = {
  models: Model[],
  meta: object
}

type ApiActionResponse = boolean | Model | null | ApiListActionResponse

type ApiActionOrFactory = ApiAction | ((results?: ApiActionResponse[]) => ApiAction)

export class ApiAction {
  protected _apiActions: ApiActionOrFactory[] = []
  protected _action!: Action
  protected _fields!: BagEntries<unknown>
  protected _params!: BagEntries<unknown>
  protected _filters!: BagEntries<ActionFilterValueType>
  protected _data!: BagEntries<unknown>
  protected _bulkIsSequential: boolean = false
  private _cancelSource!: CancelTokenSource

  public static fromRequest (apiRequest: ApiRequest): ApiAction {
    const action = new this()
    action._action = apiRequest.getAction()
    action._params = apiRequest.getParams()
    action._filters = apiRequest.getFilters()
    action._fields = apiRequest.getFields()
    action._cancelSource = apiRequest.getCancelSource()
    return action
  }

  // bulk

  public apiAction (apiAction: ApiActionOrFactory): ApiAction {
    this._apiActions.push(apiAction)
    return this
  }

  public get isBulk (): boolean {
    return !!this._apiActions.length
  }

  public sequential (sequential: boolean = true): ApiAction {
    this._bulkIsSequential = sequential
    return this
  }

  // action

  public action (
    {apiType = null, resourceType, actionName}:
    {apiType: string | null, resourceType: string, actionName: string}
  ): ApiAction {
    const action = apiResources.getAction({apiType, resourceType, actionName})
    if (action) {
      this._action = action
    }
    return this
  }

  public getAction (): Action {
    if (!this._action) {
      console.warn('ApiAction does not have an action configured.')
    }
    return this._action
  }

  // params

  public param (key: string, value: unknown): ApiAction {
    this.params(this._params || {})
    this._params[key] = value
    return this
  }

  public params (params: Record<string, unknown>): ApiAction {
    this._params = params
    return this
  }

  // filters

  public filter (name: string, value: ActionFilterValueType): ApiAction {
    this.filters(this._filters || {})
    this._filters[name] = value
    return this
  }

  public filters (filters: BagEntries<ActionFilterValueType>): ApiAction {
    this._filters = filters
    return this
  }

  public getFilters (): BagEntries<ActionFilterValueType> {
    return this._filters
  }

  // fields

  public field (name: string, value: unknown): ApiAction {
    this.fields(this._fields || {})
    this._fields[name] = value
    return this
  }

  public fields (fields: Record<string, unknown>): ApiAction {
    this._fields = fields
    return this
  }

  public getFields (): BagEntries<unknown> {
    return this._fields
  }

  // data

  public data (data: BagEntries<unknown>): ApiAction {
    this._data = data
    return this
  }

  // cancel
  public cancelSource (source: CancelTokenSource): ApiAction {
    this._cancelSource = source
    return this
  }

  // run

  public getApiRequest (): ApiRequest {
    return this._action.createRequest()
      .cancelSource(this._cancelSource)
      .params(this._params)
      .filters(this._filters)
      .fields(this._fields)
      .data(this._data)
  }

  public async execute (): Promise<ApiActionResponse | ApiActionResponse[]> {
    if (this.isBulk) {
      if (this._bulkIsSequential) {
        const results: ApiActionResponse[] = []

        this.beforeBulkRequest()

        for (let action of this._apiActions) {
          if (typeof action === 'function') {
            action = action(results)
          }

          if (!action) { // no action e.g. if callback action(results) evaluated to null
            continue
          }

          const result = await action.execute() as ApiActionResponse
          results.push(result)
        }

        this.afterBulkRequest()

        return results
      } else {
        const promises: Promise<ApiActionResponse>[] = []

        this._apiActions.forEach(a => {
          if (typeof a === 'function') {
            a = a()
          }

          if (a) { // no action e.g. if callback a() evaluated to null
            promises.push(a.execute() as Promise<ApiActionResponse>)
          }
        })

        this.beforeBulkRequest()

        const result = await Promise.all(promises)

        this.afterBulkRequest()

        return result
      }
    } else {
      const request = this.getApiRequest()

      await this.beforeRequest()

      const result = await request.send()

      await this.afterRequest()

      if (result instanceof ApiError) {
        if (result.isCancel) {
          this.processCancel(result)
        } else {
          this.processError(result)
        }
        return false
      }

      return this.processResult(result)
    }
  }

  public beforeBulkRequest (): void {
  }

  public afterBulkRequest (): void {
  }

  public beforeRequest (): Promise<unknown> {
    return Promise.resolve()
  }

  public afterRequest (): Promise<unknown> {
    return Promise.resolve()
  }

  public processResult (result: ApiResponse): ApiActionResponse {
    // single model
    if (result.data instanceof Model) {
      return result.data
    }

    // list of models
    if (result.data instanceof Array) {
      return {
        models: result.data,
        meta: result.meta
      }
    }

    // single model null
    return null
  }

  public processCancel (_result: ApiError): void {
  }

  public processError (_result: ApiError): void {
  }
}
