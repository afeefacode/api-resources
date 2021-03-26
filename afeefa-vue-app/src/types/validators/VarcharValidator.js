import { BaseValidator } from './BaseValidator'

export class VarcharValidator extends BaseValidator {
  getRules () {
    const rules = [
      this.empty,

      this.min,

      this.max,

      this.regex
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

  min = value => {
    const empty = this.getRuleParam('empty')
    const min = this.getRuleParam('min')

    if (empty !== false && !value) {
      return true
    }

    if (min) {
      if (value.length < min) {
        return this.getValidationMessage('min')
      }
    }
    return true
  }

  max = value => {
    const max = this.getRuleParam('max')

    if (max) {
      if (value.length > max) {
        return this.getValidationMessage('max')
      }
    }
    return true
  }

  regex = value => {
    const empty = this.getRuleParam('empty')
    const regex = this.getRuleParam('regex')

    if (empty !== false && !value) {
      return true
    }

    if (regex) {
      if (!(new RegExp(regex).test(value))) {
        return this.getValidationMessage('regex')
      }
    }
    return true
  }
}
