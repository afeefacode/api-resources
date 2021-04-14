import { apiResources } from '../ApiResources'
import { Validator, ValidatorJSON } from '../validator/Validator'

export type FieldJSON = {
  type: string,
  validator: ValidatorJSON
}

type FieldConstructor = {
  new (): Field,
  type: string,
}

export class Field {
  public type!: string

  constructor () {
    this.type = (this.constructor as FieldConstructor).type
  }

  private _validator: Validator | null = null

  public createTypeField (json: FieldJSON): Field {
    const field = new (this.constructor as { new (): Field })()
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
