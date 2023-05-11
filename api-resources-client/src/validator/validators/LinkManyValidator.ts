import { ModelJSON } from '../../Model'
import { FieldRule } from '../FieldRule'
import { RuleValidator, Validator } from '../Validator'

export class LinkManyValidator extends Validator<ModelJSON[]> {
  public createRuleValidator (rule: FieldRule): RuleValidator<ModelJSON[]> {
    if (rule.name === 'filled') {
      return value => {
        if (rule.params === true && !value.length) {
          return rule.message
        }
        return true
      }
    }

    return super.createRuleValidator(rule)
  }
}
