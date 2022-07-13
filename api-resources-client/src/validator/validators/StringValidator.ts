import { Rule } from '../Rule'
import { RuleValidator, Validator } from '../Validator'

export class StringValidator extends Validator<string | null> {
  public createRuleValidator (fieldLabel: string, ruleName: string, rule: Rule, params: unknown): RuleValidator<string | null> {
    if (ruleName === 'filled') {
      return value => {
        if (params === true && (!value || !value.length)) {
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    if (ruleName === 'max') {
      return value => {
        if (value && value.length > (params as number)) {
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    if (ruleName === 'min') {
      return value => {
        if (!this._params.filled && (!value || !value.length)) {
          return true
        }
        if (value && value.length < (params as number)) {
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    return super.createRuleValidator(fieldLabel, ruleName, rule, params)
  }
}
