import { Rule } from '../Rule'
import { RuleValidator, Validator } from '../Validator'

export class VarcharValidator extends Validator<string> {
  public createRuleValidator (fieldLabel: string, ruleName: string, rule: Rule, params: unknown): RuleValidator<string> {
    if (ruleName === 'filled') {
      return value => {
        if (params === true && !value.length) {
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    if (ruleName === 'max') {
      return value => {
        if (value.length > (params as number)) {
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    if (ruleName === 'min') {
      return value => {
        if (!this._params.filled && !value.length) {
          return true
        }

        if (value.length < (params as number)) {
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    return super.createRuleValidator(fieldLabel, ruleName, rule, params)
  }
}
