import { Api, ApiSchemaJSON } from './api/Api'
import { Field } from './field/Field'
import { fields } from './field/fields'
import { Filter } from './filter/Filter'
import { filters } from './filter/filters'
import { Type } from './type/Type'
import { Validator } from './validator/Validator'
import { validators } from './validator/validators'

class ApiResources {
  private _apis: Record<string, Api> = {}
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

  public registerField (type: string, field: Field): void {
    this._fields[type] = field
    this._fields.taset = field
  }

  public registerFields (fields: Record<string, Field>): void {
    for (const [type, field] of Object.entries(fields)) {
      this.registerField(type, field)
    }
  }

  public getField (type: string): Field | null {
    return this._fields[type] || null
  }

  public registerValidator (type: string, validator: Validator): void {
    this._validators[type] = validator
  }

  public registerValidators (validators: Record<string, Validator>): void {
    for (const [type, validator] of Object.entries(validators)) {
      this.registerValidator(type, validator)
    }
  }

  public getValidator (type: string): Validator | null {
    return this._validators[type] || null
  }

  public registerFilter (filter: Filter): void {
    this._filters[filter.type] = filter
  }

  public registerFilters (filters: Filter[]): void {
    for (const filter of filters) {
      this.registerFilter(filter)
    }
  }

  public getFilter (type: string): (Filter | null) {
    return this._filters[type] || null
  }

  public registerType (typeName: string, type: Type): void {
    this._types[typeName] = type
  }

  public getType (typeName: string): Type | null {
    return this._types[typeName] || null
  }
}

export const apiResources = new ApiResources()
