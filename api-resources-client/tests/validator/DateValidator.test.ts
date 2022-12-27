import { FieldRule } from '../../src/validator/FieldRule'
import { Rule } from '../../src/validator/Rule'
import { RuleValidator } from '../../src/validator/Validator'
import { DateValidator } from '../../src/validator/validators/DateValidator'

function createDateValidator (ruleName: string, params = {}, message: string = ''): RuleValidator<Date | null> {
  const validator = new DateValidator()
  const rule = new Rule(ruleName, { message })
  const fieldRule = new FieldRule(rule, params, 'MyDate')
  return validator.createRuleValidator(fieldRule)
}

describe.each([
  new Date(),
  null
])('date', value => {
  test('valid date: ' + String(value), () => {
    const ruleValidator = createDateValidator('date')
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  'test',
  '1',
  '1.1',
  '-1',
  -1,
  1.1,
  -1.1,
  [],
  this,
  '',
  () => {}
])('date', value => {
  test('invalid date: ' + String(value), () => {
    const ruleValidator = createDateValidator('date', {}, '{{ fieldLabel }} must be Date.')
    expect(ruleValidator(value as any)).toBe('MyDate must be Date.')
  })
})

describe.each([
  new Date(),
  null
])('filled', value => {
  test('valid filled: ' + String(value), () => {
    const ruleValidator = createDateValidator('filled')
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  '',
  null
])('filled', value => {
  test('invalid filled: ' + String(value), () => {
    const ruleValidator = createDateValidator('filled', { filled: true }, '{{ fieldLabel }} muss ausgefüllt sein.')
    expect(ruleValidator(value as any)).toBe('MyDate muss ausgefüllt sein.')
  })
})
