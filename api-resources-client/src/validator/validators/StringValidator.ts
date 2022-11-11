import { FieldRule } from '../FieldRule'
import { RuleValidator, Validator } from '../Validator'

export class StringValidator extends Validator<string | null> {
  public createRuleValidator (rule: FieldRule): RuleValidator<string | null> {
    if (rule.name === 'string') {
      return value => {
        // validate null in null-rule
        if (value === null) {
          return true
        }

        if (typeof value !== 'string') {
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

        if (filled && (!value || !value.length)) {
          return rule.message
        }

        return true
      }
    }

    if (rule.name === 'max') {
      return value => {
        const max = rule.params ? Number(rule.params) : false

        if (max !== false && value && value.length > max) {
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

        if (typeof value === 'string' && value.length < min) {
          return rule.message
        }

        return true
      }
    }

    return super.createRuleValidator(rule)
  }

  public getEmptyValue (params: Record<string, unknown>): unknown {
    return params.null ? null : ''
  }

  public getMaxValueLength (params: Record<string, unknown>): number | null {
    return params.max as number || null
  }
}
