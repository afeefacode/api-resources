import { Action } from '../action/Action'
import { ApiRequest, ApiRequestJSON } from '../api/ApiRequest'
import { apiResources } from '../ApiResources'
import { Model, ModelJSON } from '../Model'
import { Validator, ValidatorJSON } from '../validator/Validator'

export type FieldJSON = {
  type: string
  validator: ValidatorJSON
  options: Record<string, string>
  options_request: ApiRequestJSON
}

export type FieldValue = boolean | string | number | Date | null | Model | Model[]

export type FieldJSONValue = boolean | string | number | null | ModelJSON | ModelJSON[]

type FieldConstructor<T> = {
  new (): T
  type: string
}

type RequestFactory = (() => ApiRequest) | null

export class Field {
  public type!: string

  private _validator: Validator | null = null

  private _options: Record<string, string> = {}
  private _optionsRequestFactory: RequestFactory = null

  constructor () {
    this.type = (this.constructor as FieldConstructor<Field>).type
  }

  public newInstance<T> (): T {
    return new (this.constructor as { new (): T })()
  }

  public createTypeField (json: FieldJSON): Field {
    const field = this.newInstance<Field>()

    if (json.options_request) {
      const optionsRequest = json.options_request
      const api = apiResources.getApi(optionsRequest.api)
      if (api) {
        field._optionsRequestFactory = (): ApiRequest => {
          const requestAction = api.getAction(optionsRequest.resource, optionsRequest.action)
          return new ApiRequest(optionsRequest)
            .action(requestAction as Action)
        }
      }
    }

    if (json.options) {
      field._options = json.options
    }

    field.setupTypeFieldValidator(json.validator)

    return field
  }

  public getValidator (): Validator | null {
    return this._validator
  }

  public hasOptionsRequest (): boolean {
    return !!this._optionsRequestFactory
  }

  public getOptionsRequest (): ApiRequest | null {
    if (this._optionsRequestFactory) {
      return this._optionsRequestFactory()
    }
    return null
  }

  public hasOptions (): boolean {
    return !!Object.keys(this._options).length
  }

  public getOptions (): Record<string, string> {
    return this._options
  }

  public default (): FieldValue {
    return null
  }

  public deserialize (value: FieldJSONValue): FieldValue {
    return value as FieldValue
  }

  public serialize (value: FieldValue): FieldJSONValue {
    return value as FieldJSONValue
  }

  protected setupTypeFieldValidator (json: ValidatorJSON): void {
    if (json) {
      const validator = apiResources.getValidator(json.type)
      if (validator) {
        this._validator = validator.createFieldValidator(json)
      } else {
        console.warn(`No field validator of type ${json.type}.`)
      }
    }
  }
}
