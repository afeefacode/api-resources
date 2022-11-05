import { FieldRule } from '../FieldRule'
import { RuleValidator, Validator } from '../Validator'

export class SelectValidator extends Validator<unknown> {
  public createRuleValidator (rule: FieldRule): RuleValidator<unknown> {
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
