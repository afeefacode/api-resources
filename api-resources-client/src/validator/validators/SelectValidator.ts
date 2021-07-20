import { Rule } from '../Rule'
import { RuleValidator, Validator } from '../Validator'

export class SelectValidator extends Validator<unknown> {
  protected createRuleValidator (fieldLabel: string, ruleName: string, rule: Rule, params: unknown): RuleValidator<unknown> {
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
