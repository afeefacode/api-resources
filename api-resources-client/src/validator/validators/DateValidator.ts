import { Rule } from '../Rule'
import { RuleValidator, Validator } from '../Validator'

export class DateValidator extends Validator<Date | null> {
  public createRuleValidator (fieldLabel: string, ruleName: string, rule: Rule, params: unknown): RuleValidator<Date | null> {
    if (ruleName === 'date') {
      return value => {
        if (value !== null && !(value instanceof Date)) { // validate null later
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    if (ruleName === 'null') {
      return value => {
        if (params === true && !value && value !== null) {
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    if (ruleName === 'filled') {
      return value => {
        if (params === true && !value) {
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    return super.createRuleValidator(fieldLabel, ruleName, rule, params)
  }
}
