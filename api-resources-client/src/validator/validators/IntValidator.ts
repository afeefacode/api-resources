import { FieldRule } from '../FieldRule'
import { RuleValidator, Validator } from '../Validator'

export class IntValidator extends Validator<string | number | null> {
  public createRuleValidator (rule: FieldRule): RuleValidator<string | number | null> {
    if (rule.name === 'int') {
      return value => {
        // validate no value or 0 in min or filled
        if (!value) {
          return true
        }

        // not an int
        if (isNaN(Number(value)) || Number(value) !== parseInt(String(value))) {
          return rule.message
        }

        // non negative
        if (Number(value) < 0) {
          return rule.message
        }

        return true
      }
    }

    if (rule.name === 'null') {
      return value => {
        const allowNull = rule.params === true

        // null only allowed if set
        if (!allowNull && value === null) {
          return rule.message
        }

        return true
      }
    }

    if (rule.name === 'filled') {
      return value => {
        const filled = rule.params === true

        // filled and value is empty
        if (filled && !value && value !== 0) {
          return rule.message
        }

        return true
      }
    }

    if (rule.name === 'max') {
      return value => {
        const max = rule.params ? Number(rule.params) : false
        value = Number(value)

        // max is set and value > max
        if (max !== false && value > max) {
          return rule.message
        }

        return true
      }
    }

    if (rule.name === 'min') {
      return value => {
        const filled = rule.getParams('filled') === true
        const min = (rule.params || rule.params === 0) ? Number(rule.params) : false

        // no value is okay, if not must filled
        if (!value && value !== 0 && !filled) {
          return true
        }

        // min is set and value < min
        value = Number(value) // '' => 0, null => 0
        if (min !== false && value < min) {
          return rule.message
        }

        return true
      }
    }

    return super.createRuleValidator(rule)
  }
}
