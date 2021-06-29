import { ModelJSON } from '../../Model'
import { Rule } from '../Rule'
import { RuleValidator, Validator } from '../Validator'

export class LinkOneValidator extends Validator<ModelJSON | null> {
  protected createRuleValidator (fieldLabel: string, ruleName: string, rule: Rule, params: unknown): RuleValidator<ModelJSON | null> {
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
