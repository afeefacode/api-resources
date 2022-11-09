import { FieldRule } from '../FieldRule'
import { RuleValidator, Validator } from '../Validator'

export class DateValidator extends Validator<Date | null> {
  public createRuleValidator (rule: FieldRule): RuleValidator<Date | null> {
    if (rule.name === 'date') {
      return value => {
        // validate null in null-rule
        if (value === null) {
          return true
        }

        // not a date
        if (!(value instanceof Date)) {
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

    return super.createRuleValidator(rule)
  }
}
