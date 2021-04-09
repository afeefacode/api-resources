import { apiResources } from '../ApiResources'
import { Validator, ValidatorJSON } from '../validator/Validator'

export type FieldJSON = {
  type: string,
  validator: ValidatorJSON
}

export class Field {
  private _validator: Validator | null = null

  public createTypeField (json: FieldJSON): Field {
    const field = new (this.constructor as { new (): Field })()
    field.setupTypeFieldValidator(json.validator)
    return field
  }

  protected setupTypeFieldValidator (json: ValidatorJSON) {
    if (json) {
      const validator = apiResources.getValidator(json.type)
      if (validator) {
        this._validator = validator.createFieldValidator(json)
      }
    }
  }
}
