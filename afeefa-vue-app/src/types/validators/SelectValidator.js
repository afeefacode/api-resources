import { BaseValidator } from './BaseValidator'

export class SelectValidator extends BaseValidator {
  options = []

  getRules () {
    const rules = [
      this.allowed
    ]
    return rules
  }

  allowed = value => {
    if (!this.options.length) {
      return true
    }

    const hasOption = !!this.options.find(o => o.value === value)
    return hasOption || this.fieldName + ' sollte einen gültigen Wert beinhalten.'
  }
}
