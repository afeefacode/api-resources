import { ModelJSON } from 'src/Model'

import { Rule } from '../Rule'
import { RuleValidator, Validator } from '../Validator'

export class LinkOneValidator extends Validator<ModelJSON | null> {
  protected createRuleValidator (ruleName: string, rule: Rule, params: unknown): RuleValidator<ModelJSON | null> {
    if (ruleName === 'filled') {
      return value => {
        if (params === true && !value) {
          return rule.getMessage(this._fieldName, params)
        }
        return true
      }
    }

    return super.createRuleValidator(ruleName, rule, params)
  }
}
