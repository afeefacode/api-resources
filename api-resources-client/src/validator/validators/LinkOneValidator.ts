import { ModelJSON } from '../../Model.js'
import { FieldRule } from '../FieldRule.js'
import { RuleValidator, Validator } from '../Validator.js'

export class LinkOneValidator extends Validator<ModelJSON | null> {
  public createRuleValidator (rule: FieldRule): RuleValidator<ModelJSON | null> {
    if (rule.name === 'filled') {
      return value => {
        if (rule.params === true && !value) {
          return rule.message
        }
        return true
      }
    }

    return super.createRuleValidator(rule)
  }
}
