import { FieldRule } from '../FieldRule'
import { RuleValidator } from '../Validator'
import { NumberValidator } from './NumberValidator'

export class IntValidator extends NumberValidator {
  public createRuleValidator (rule: FieldRule): RuleValidator<number | null> {
    if (rule.name === 'int') {
      return value => {
        // validate null in null-rule
        if (value === null) {
          return true
        }

        // not an int
        if (!Number.isInteger(value)) {
          return rule.message
        }

        return true
      }
    }

    return super.createRuleValidator(rule)
  }
}
