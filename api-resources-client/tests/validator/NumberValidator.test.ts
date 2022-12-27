import { FieldRule } from '../../src/validator/FieldRule'
import { Rule } from '../../src/validator/Rule'
import { RuleValidator } from '../../src/validator/Validator'
import { NumberValidator } from '../../src/validator/validators/NumberValidator'

function createNumberValidator (ruleName: string, params = {}, message: string = ''): RuleValidator<number | null> {
  const validator = new NumberValidator()
  const rule = new Rule(ruleName, { message })
  const fieldRule = new FieldRule(rule, params, 'MyNumber')
  return validator.createRuleValidator(fieldRule)
}

describe.each([
  0,
  1,
  1000,
  3.0,
  3.3,
  -1,
  -3.3,
  null
])('number', value => {
  test('valid number: ' + String(value), () => {
    const ruleValidator = createNumberValidator('number')
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  '',
  '1',
  '3.0',
  '3',
  '1.1',
  '-3',
  NaN,
  'abc',
  {},
  () => {}
])('number', value => {
  test('invalid number: ' + String(value), () => {
    const ruleValidator = createNumberValidator('number', {}, '{{ fieldLabel }} must be Number.')
    expect(ruleValidator(value as any)).toBe('MyNumber must be Number.')
  })
})

describe.each([
  0,
  1
])('filled', value => {
  test('valid filled: ' + String(value), () => {
    const ruleValidator = createNumberValidator('filled', { filled: true })
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  '',
  null
])('filled', value => {
  test('invalid filled: ' + String(value), () => {
    const ruleValidator = createNumberValidator('filled', { filled: true }, '{{ fieldLabel }} muss ausgefüllt sein.')
    expect(ruleValidator(value as any)).toBe('MyNumber muss ausgefüllt sein.')
  })
})

describe.each([
  4,
  5
])('max', value => {
  test('valid max: ' + String(value), () => {
    const ruleValidator = createNumberValidator('max', { max: 5 })
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  6
])('max', value => {
  test('invalid max: ' + String(value), () => {
    const ruleValidator = createNumberValidator('max', { max: 5 }, '{{ fieldLabel }} muss <= {{ param }} sein.')
    expect(ruleValidator(value as any)).toBe('MyNumber muss <= 5 sein.')
  })
})

describe.each([
  5,
  6
])('min', value => {
  test('valid min: ' + String(value), () => {
    const ruleValidator = createNumberValidator('min', { min: 5 })
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  4
])('min', value => {
  test('invalid min: ' + String(value), () => {
    const ruleValidator = createNumberValidator('min', { min: 5 }, '{{ fieldLabel }} muss >= {{ param }} sein.')
    expect(ruleValidator(value as any)).toBe('MyNumber muss >= 5 sein.')
  })
})
