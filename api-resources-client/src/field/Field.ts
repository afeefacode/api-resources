import { apiResources } from '../ApiResources'
import { Validator, ValidatorJSON } from '../validator/Validator'

export type FieldJSON = {
  type: string,
  validator: ValidatorJSON
}

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

  protected setupTypeFieldValidator (json: ValidatorJSON): void {
    if (json) {
      const validator = apiResources.getValidator(json.type)
      if (validator) {
        this._validator = validator.createFieldValidator(json)
      }
    }
  }
}
