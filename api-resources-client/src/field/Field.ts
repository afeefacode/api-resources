import { Validator, ValidatorJSON } from '../validator/Validator'
import { getValidator } from '../validator/ValidatorRegistry'

export type FieldJSON = {
  type: string,
  validator: ValidatorJSON
}

export class Field {
  private _validator: Validator | null = null

  constructor (json: FieldJSON) {
    if (json.validator) {
      const validator = getValidator(json.validator.type)
      if (validator) {
        this._validator = validator.createInstance(json.validator)
      }
    }
  }
}
