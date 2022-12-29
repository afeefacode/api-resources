import axios from 'axios'

import { Action } from '../action/Action'
import { apiResources } from '../ApiResources'
import { ModelJSON } from '../Model'
import { Resource, ResourceJSON } from '../resource/Resource'
import { Type, TypeJSON } from '../type/Type'
import { Validator, ValidatorJSON } from '../validator/Validator'

export type ApiSchemaJSON = {
  types: Record<string, TypeJSON>
  resources: Record<string, ResourceJSON>
  validators: Record<string, ValidatorJSON>
}

export type ResultDataJSON = {
  data: ModelJSON | ModelJSON[]
}

export class Api {
  private _baseUrl
  private _resources: Record<string, Resource> = {}
  private _types: Record<string, Type> = {}
  private _validators: Record<string, Validator> = {}

  constructor (baseUrl: string) {
    this._baseUrl = baseUrl
  }

  public getBaseUrl (): string {
    return this._baseUrl
  }

  public async loadSchema (): Promise<ApiSchemaJSON> {
    const result = await axios.get(`${this._baseUrl}/schema`)
    const schema: ApiSchemaJSON = result.data as ApiSchemaJSON

    for (const [name, resourceJSON] of Object.entries(schema.resources)) {
      const resource = new Resource(this, name, resourceJSON)
      this._resources[name] = resource
    }

    for (const [type, validatorJSON] of Object.entries(schema.validators)) {
      const validator = apiResources.getValidator(type)
      if (validator) {
        validator.setSanitizers(validatorJSON.sanitizers)
        validator.setRules(validatorJSON.rules)
        this._validators[type] = validator
      }
    }

    for (const [typeName, typeJSON] of Object.entries(schema.types)) {
      const type = new Type(typeName, typeJSON)
      this._types[typeName] = type

      apiResources.registerType(typeName, type)
    }

    return schema
  }

  public getResource (resourceType: string): Resource | null {
    return this._resources[resourceType] || null
  }

  public getAction (resourceType: string, actionName: string): Action | null {
    const resource = this._resources[resourceType]
    if (!resource) {
      console.warn(`No resource '${resourceType}' configured.`)
      return null
    }
    return resource.getAction(actionName)
  }
}
