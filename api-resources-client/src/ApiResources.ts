import { Action } from './action/Action'
import { Api, ApiSchemaJSON } from './api/Api'
import { ApiRequest } from './api/ApiRequest'
import { Field } from './field/Field'
import { fields } from './field/fields'
import { Filter } from './filter/Filter'
import { filters } from './filter/filters'
import { Model } from './Model'
import { Type } from './type/Type'
import { Validator } from './validator/Validator'
import { validators } from './validator/validators'

type ModelType = typeof Model

class ApiResources {
  private _apis: Record<string, Api> = {}
  private _defaultApiType: string | null = null
  private _models: Record<string, typeof Model> = {}
  private _fields: Record<string, Field> = {}
  private _validators: Record<string, Validator> = {}
  private _filters: Record<string, Filter> = {}
  private _types: Record<string, Type> = {}

  private _schemasToLoad: Promise<ApiSchemaJSON>[] = []

  constructor () {
    this.registerFields(fields)
    this.registerFilters(filters)
    this.registerValidators(validators)
  }

  public schemasLoaded (): Promise<ApiSchemaJSON[]> {
    return Promise.all(this._schemasToLoad)
  }

  public registerApi (type: string, baseUrl: string): ApiResources {
    const api = new Api(baseUrl)
    this._apis[type] = api

    if (!this._defaultApiType) {
      this.defaultApi(type)
    }

    const promise = api.loadSchema()
    this._schemasToLoad.push(promise)

    return this
  }

  public registerApis (apis: Record<string, string>): ApiResources {
    for (const [type, baseUrl] of Object.entries(apis)) {
      this.registerApi(type, baseUrl)
    }
    return this
  }

  public defaultApi (type: string): ApiResources {
    if (this.hasApi(type)) {
      this._defaultApiType = type
    } else {
      console.warn(`No api configured for type ${type}`)
    }
    return this
  }

  public getApi (type: string): Api | null {
    return this._apis[type] || null
  }

  public hasApi (type: string): boolean {
    return !!this._apis[type]
  }

  public createRequest (
    {api: apiType = null, resource: resourceType, action: actionName}:
    {api: string | null, resource: string, action: string}
  ): ApiRequest | null {
    const action = this.getAction({
      api: apiType,
      resource: resourceType,
      action: actionName
    })
    if (action) {
      return action.createRequest()
    }
    return null
  }

  public getAction (
    {api: apiType = null, resource: resourceType, action: actionName}:
    {api: string | null, resource: string, action: string}
  ): Action | null {
    apiType = apiType || this._defaultApiType

    if (!apiType) {
      console.warn('No default api configured.')
      return null
    }

    if (!this.hasApi(apiType)) {
      console.warn(`No api '${apiType}' configured.`)
      return null
    }

    const api = this.getApi(apiType)!
    const action = api.getAction(resourceType, actionName)

    if (!action) {
      console.warn(`No action '${actionName}' found for resource '${resourceType}'.`)
      return null
    }

    return action
  }

  public registerField (field: Field): ApiResources {
    this._fields[field.type] = field

    return this
  }

  public registerFields (fields: Field[]): ApiResources {
    for (const field of fields) {
      this.registerField(field)
    }

    return this
  }

  public getField (type: string): Field | null {
    return this._fields[type] || null
  }

  public registerModel (Model: ModelType): ApiResources {
    this._models[Model.type] = Model

    return this
  }

  public registerModels (models: ModelType[]): ApiResources {
    for (const Model of models) {
      this.registerModel(Model)
    }

    return this
  }

  public getModel (type: string): ModelType | null {
    return this._models[type] || null
  }

  public registerValidator (type: string, validator: Validator): ApiResources {
    this._validators[type] = validator

    return this
  }

  public registerValidators (validators: Record<string, Validator>): ApiResources {
    for (const [type, validator] of Object.entries(validators)) {
      this.registerValidator(type, validator)
    }

    return this
  }

  public getValidator (type: string): Validator | null {
    return this._validators[type] || null
  }

  public registerFilter (filter: Filter): ApiResources {
    this._filters[filter.type] = filter

    return this
  }

  public registerFilters (filters: Filter[]): ApiResources {
    for (const filter of filters) {
      this.registerFilter(filter)
    }

    return this
  }

  public getFilter (type: string): (Filter | null) {
    return this._filters[type] || null
  }

  public registerType (typeName: string, type: Type): ApiResources {
    this._types[typeName] = type

    return this
  }

  public getType (typeName: string): Type | null {
    return this._types[typeName] || null
  }
}

export const apiResources = new ApiResources()
