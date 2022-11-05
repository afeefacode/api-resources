import { ModelJSON } from '../../Model'
import { FieldRule } from '../FieldRule'
import { RuleValidator, Validator } from '../Validator'

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
