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
  private _fields: Record<string, typeof Field> = {}
  private _validators: Record<string, Validator> = {}
  private _filters: Record<string, typeof Filter> = {}
  private _types: Record<string, Type> = {}

  private _schemasToLoad: Promise<ApiSchemaJSON>[] = []
  private _schmemaLoadCount = 0

  constructor () {
    this.registerFields(fields)
    this.registerFilters(filters)
    this.registerValidators(validators)
  }

  public get isLoaded (): boolean {
    return this._schmemaLoadCount === this._schemasToLoad.length
  }

  public loaded (): Promise<ApiSchemaJSON[]> {
    return Promise.all(this._schemasToLoad)
  }

  public registerApi (name: string, baseUrl: string): Api {
    const api = new Api(baseUrl)
    this._apis[name] = api

    const promise = api.loadSchema().then(result => {
      this._schmemaLoadCount++
      return result
    })
    this._schemasToLoad.push(promise)

    return api
  }

  public registerApis (apis: Record<string, string>): void {
    for (const [name, baseUrl] of Object.entries(apis)) {
      this.registerApi(name, baseUrl)
    }
  }

  public getApi (name: string): Api | null {
    return this._apis[name] || null
  }

  public setup (): Promise<ApiSchemaJSON[]> {
    const promises = Object.values(this._apis)
      .map(a => a.loadSchema())
    return Promise.all(promises)
  }

  public registerField (type: string, FieldClass: typeof Field): void {
    this._fields[type] = FieldClass
    this._fields.taset = FieldClass
  }

  public registerFields (fields: Record<string, typeof Field>): void {
    for (const [type, FieldClass] of Object.entries(fields)) {
      this.registerField(type, FieldClass)
    }
  }

  public getField (type: string): (typeof Field | null) {
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

  public registerFilter (type: string, FilterClass: typeof Filter): void {
    this._filters[type] = FilterClass
  }

  public registerFilters (filters: Record<string, typeof Filter>): void {
    for (const [type, FilterClass] of Object.entries(filters)) {
      this.registerFilter(type, FilterClass)
    }
  }

  public getFilter (type: string): (typeof Filter | null) {
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
