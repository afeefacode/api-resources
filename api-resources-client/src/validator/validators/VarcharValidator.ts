import { Rule } from '../Rule'
import { RuleValidator, Validator } from '../Validator'

export class VarcharValidator extends Validator {
  protected createRuleValidator (ruleName: string, rule: Rule, params: unknown, fieldName: string): RuleValidator {
    if (ruleName === 'max') {
      return (value: unknown): boolean | string => {
        if ((value as string).length > (params as number)) {
          return rule.getMessage(fieldName, params)
        }
        return true
      }
    }

    if (ruleName === 'min') {
      return (value: unknown): boolean | string => {
        if ((value as string).length < (params as number)) {
          return rule.getMessage(fieldName, params)
        }
        return true
      }
    }

    return super.createRuleValidator(ruleName, rule, params, fieldName)
  }
}
