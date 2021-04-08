import axios from 'axios'

import { Request } from '../Request'
import { Resource, ResourceJSON } from '../resource/Resource'
import { Type, TypeJSON } from '../type/Type'
import { registerType } from '../type/TypeRegistry'
import { Validator, ValidatorJSON } from '../validator/Validator'
import { getValidator } from '../validator/ValidatorRegistry'

type SchemaJSON = {
  types: Record<string, TypeJSON>,
  resources: Record<string, ResourceJSON>,
  validators: Record<string, ValidatorJSON>,
}

export class Api {
  private _baseUrl
  private _resources: Record<string, Resource> = {}
  private _types: Record<string, Type> = {}
  private _validators: Record<string, Validator> = {}

  constructor (baseUrl: string) {
    this._baseUrl = baseUrl
    void this.loadSchema()
  }

  public getBaseUrl (): string {
    return this._baseUrl
  }

  private async loadSchema (): Promise<SchemaJSON> {
    const result = await axios.get(`${this._baseUrl}/schema`)
    const schema: SchemaJSON = result.data as SchemaJSON

    for (const [name, resourceJSON] of Object.entries(schema.resources)) {
      const resource = new Resource(resourceJSON)
      this._resources[name] = resource
    }

    for (const [type, validatorJSON] of Object.entries(schema.validators)) {
      const validator = getValidator(type)
      if (validator) {
        validator.setup(validatorJSON)
        this._validators[type] = validator
      }
    }

    for (const [typeName, typeJSON] of Object.entries(schema.types)) {
      const type = new Type(typeJSON)
      this._types[typeName] = type

      registerType(typeName, type)
    }

    return schema
  }

  public request (): Request {
    return new Request()
      .api(this)
  }
}
