import { FieldRule } from '../FieldRule'
import { RuleValidator, Validator } from '../Validator'

export class StringValidator extends Validator<string | null> {
  public createRuleValidator (rule: FieldRule): RuleValidator<string | null> {
    if (rule.name === 'filled') {
      return value => {
        if (rule.params === true && (!value || !value.length)) {
          return rule.message
        }
        return true
      }
    }

    if (rule.name === 'max') {
      return value => {
        if (value && value.length > (rule.params as number)) {
          return rule.message
        }
        return true
      }
    }

    if (rule.name === 'min') {
      return value => {
        if (!rule.getParams('filled') && (!value || !value.length)) {
          return true
        }
        if (value && value.length < (rule.params as number)) {
          return rule.message
        }
        return true
      }
    }

    return super.createRuleValidator(rule)
  }
}
