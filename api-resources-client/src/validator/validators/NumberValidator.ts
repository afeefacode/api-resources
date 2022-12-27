import { FieldRule } from '../FieldRule'
import { RuleValidator, Validator } from '../Validator'

export class NumberValidator extends Validator<number | null> {
  public createRuleValidator (rule: FieldRule): RuleValidator<number | null> {
    if (rule.name === 'number') {
      return value => {
        // validate null in filled-rule
        if (value === null) {
          return true
        }

        // not a number
        if (typeof value !== 'number' || Number.isNaN(value)) {
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
        const min = (rule.params || rule.params === 0) ? Number(rule.params) : false

        if (min === false) {
          return true
        }

        // no value is okay, validate in null/filled
        if (!value && value !== 0) {
          return true
        }

        // min is set and value < min
        value = Number(value) // '' => 0, null => 0
        if (value < min) {
          return rule.message
        }

        return true
      }
    }

    return super.createRuleValidator(rule)
  }

  protected valueIsFilled (value: number | null): boolean {
    return !!value || value === 0
  }
}
