import { FieldRule } from '../FieldRule'
import { RuleValidator, Validator } from '../Validator'

export class DateValidator extends Validator<Date | null> {
  public createRuleValidator (rule: FieldRule): RuleValidator<Date | null> {
    if (rule.name === 'date') {
      return value => {
        // validate null in filled-rule
        if (value === null) {
          return true
        }

        // not a date
        if (!(value instanceof Date)) {
          return rule.message
        }

        return true
      }
    }

    if (rule.name === 'max_day') {
      return value => {
        const maxDateString: string|false = rule.params as string || false

        if (maxDateString === false) {
          return true
        }

        // empty value cannot exceed max
        if (!value) {
          return true
        }

        const maxDate = new Date(maxDateString)

        if (value > maxDate) {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }

          const maxLocalDateString = maxDate.toLocaleDateString('de-DE', options)
          return rule.rule.getMessage(rule.fieldLabel, maxLocalDateString)
        }

        return true
      }
    }

    return super.createRuleValidator(rule)
  }
}
