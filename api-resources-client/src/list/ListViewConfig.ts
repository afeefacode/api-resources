import { Action } from '../action/Action'
import { apiResources } from '../ApiResources'
import { BagEntries } from '../bag/Bag'
import { FilterValueType } from '../filter/Filter'

export class ListViewConfig {
  private _action!: Action | null
  private _fields: BagEntries<unknown> = {}
  private _params: BagEntries<unknown> = {}
  private _filters: BagEntries<FilterValueType> = {}

  public action (
    {apiType = null, resourceType, actionName}:
    {apiType: string | null, resourceType: string, actionName: string}
  ): ListViewConfig {
    this._action = apiResources.getAction({
      api: apiType,
      resource: resourceType,
      action: actionName
    })
    return this
  }

  public getAction (): Action | null {
    return this._action
  }

  public params (params: BagEntries<unknown>): ListViewConfig {
    this._params = params
    return this
  }

  public getParams (): BagEntries<unknown> {
    return this._params
  }

  public filters (filters: BagEntries<FilterValueType>): ListViewConfig {
    this._filters = filters
    return this
  }

  public getFilters (): BagEntries<FilterValueType> {
    return this._filters
  }

  public fields (fields: BagEntries<unknown>): ListViewConfig {
    this._fields = fields
    return this
  }

  public getFields (): BagEntries<unknown> {
    return this._fields
  }
}
