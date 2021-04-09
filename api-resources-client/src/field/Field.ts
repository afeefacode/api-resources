import { apiResources } from '../ApiResources'
import { Validator, ValidatorJSON } from '../validator/Validator'

export type FieldJSON = {
  type: string,
  validator: ValidatorJSON
}

export class Field {
  private _validator: Validator | null = null

  constructor (json: FieldJSON) {
    if (json.validator) {
      const validator = apiResources.getValidator(json.validator.type)
      if (validator) {
        this._validator = validator.createInstance(json.validator)
      }
    }
  }
}
