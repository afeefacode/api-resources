import { Rule } from '../Rule'
import { RuleValidator, Validator } from '../Validator'

export class IntValidator extends Validator<string | number | null> {
  public createRuleValidator (fieldLabel: string, ruleName: string, rule: Rule, params: unknown): RuleValidator<string | number | null> {
    if (ruleName === 'number') {
      return value => {
        if (isNaN(Number(value)) || Number(value) !== parseInt(String(value))) {
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    if (ruleName === 'filled') {
      return value => {
        value = Number(value)
        if (params === true && !value) {
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    if (ruleName === 'min') {
      return value => {
        value = Number(value)
        if (!this._params.filled && !value) {
          return true
        }

        if (value < (params as number)) {
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    if (ruleName === 'max') {
      return value => {
        value = Number(value)
        if (value > (params as number)) {
          return rule.getMessage(fieldLabel, params)
        }
        return true
      }
    }

    return super.createRuleValidator(fieldLabel, ruleName, rule, params)
  }
}
