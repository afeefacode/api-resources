import { Api, ApiSchemaJSON } from './api/Api'
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

  public registerApi (name: string, baseUrl: string): ApiResources {
    const api = new Api(baseUrl)
    this._apis[name] = api

    const promise = api.loadSchema()
    this._schemasToLoad.push(promise)

    return this
  }

  public registerApis (apis: Record<string, string>): ApiResources {
    for (const [name, baseUrl] of Object.entries(apis)) {
      this.registerApi(name, baseUrl)
    }
    return this
  }

  public getApi (name: string): Api | null {
    return this._apis[name] || null
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
