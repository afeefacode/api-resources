import { BaseValidator } from './BaseValidator'

export class BelongsToValidator extends BaseValidator {
  getRules () {
    const rules = [
      this.empty
    ]
    return rules
  }

  empty = value => {
    const empty = this.getRuleParam('empty')
    if (empty === false) {
      if (!value) {
        return this.getValidationMessage('empty')
      }
    }
    return true
  }
}
