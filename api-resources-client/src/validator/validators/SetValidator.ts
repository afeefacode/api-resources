import { FieldRule } from '../FieldRule'
import { RuleValidator, Validator } from '../Validator'

export class SetValidator extends Validator<string[]> {
  public createRuleValidator (rule: FieldRule): RuleValidator<string[]> {
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
