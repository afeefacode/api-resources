import { apiResources } from '../ApiResources'
import { Model, ModelJSON } from '../Model'
import { Validator, ValidatorJSON } from '../validator/Validator'

export type FieldJSON = {
  type: string,
  validator: ValidatorJSON
}

export type FieldValue = boolean | string | number | Date | null | Model | Model[]

export type FieldJSONValue = boolean | string | number | null | ModelJSON | ModelJSON[]

type FieldConstructor<T> = {
  new (): T,
  type: string,
}

export class Field {
  public type!: string

  constructor () {
    this.type = (this.constructor as FieldConstructor<Field>).type
  }

  private _validator: Validator | null = null

  public newInstance<T> (): T {
    return new (this.constructor as { new (): T })()
  }

  public createTypeField (json: FieldJSON): Field {
    const field = this.newInstance<Field>()
    field.setupTypeFieldValidator(json.validator)
    return field
  }

  public getValidator (): Validator | null {
    return this._validator
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
        console.warn('No field validator of type', json.type)
      }
    }
  }
}
