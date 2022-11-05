import { FieldRule } from '../../src/validator/FieldRule'
import { Rule } from '../../src/validator/Rule'
import { RuleValidator } from '../../src/validator/Validator'
import { IntValidator } from '../../src/validator/validators/IntValidator'

function createIntValidator (ruleName: string, params = {}, message: string = ''): RuleValidator<string | number | null> {
  const validator = new IntValidator()
  const rule = new Rule(ruleName, { message })
  const fieldRule = new FieldRule(rule, params, 'MyInt')
  const ruleValidator = validator.createRuleValidator(fieldRule)
  return ruleValidator
}

describe.each([
  0,
  1,
  1000,
  3.0,
  null,
  '',
  '1',
  '3.0',
  '3'
])('int', value => {
  test('valid int: ' + String(value), () => {
    const ruleValidator = createIntValidator('int')
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  -1,
  3.3,
  '1.1',
  '-3',
  'abc',
  {},
  () => {}
])('int', value => {
  test('invalid int: ' + String(value), () => {
    const ruleValidator = createIntValidator('int', {}, '{{ fieldLabel }} must be Int.')
    expect(ruleValidator(value as any)).toBe('MyInt must be Int.')
  })
})

describe.each([
  0,
  1
])('filled', value => {
  test('valid filled: ' + String(value), () => {
    const ruleValidator = createIntValidator('filled')
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  '',
  null
])('filled', value => {
  test('invalid filled: ' + String(value), () => {
    const ruleValidator = createIntValidator('filled', { filled: true }, '{{ fieldLabel }} muss ausgefüllt sein.')
    expect(ruleValidator(value as any)).toBe('MyInt muss ausgefüllt sein.')
  })
})

describe.each([
  0,
  1,
  null
])('null', value => {
  test('valid null: ' + String(value), () => {
    const ruleValidator = createIntValidator('null', { null: true })
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  null
])('null', value => {
  test('invalid null: ' + String(value), () => {
    const ruleValidator = createIntValidator('null', {}, '{{ fieldLabel }} darf nicht null sein.')
    expect(ruleValidator(value as any)).toBe('MyInt darf nicht null sein.')
  })
})

describe.each([
  4,
  5
])('max', value => {
  test('valid max: ' + String(value), () => {
    const ruleValidator = createIntValidator('max', { max: 5 })
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  6
])('max', value => {
  test('invalid max: ' + String(value), () => {
    const ruleValidator = createIntValidator('max', { max: 5 }, '{{ fieldLabel }} muss <= {{ param }} sein.')
    expect(ruleValidator(value as any)).toBe('MyInt muss <= 5 sein.')
  })
})

describe.each([
  5,
  6
])('min', value => {
  test('valid min: ' + String(value), () => {
    const ruleValidator = createIntValidator('min', { min: 5 })
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  4
])('min', value => {
  test('invalid min: ' + String(value), () => {
    const ruleValidator = createIntValidator('min', { min: 5 }, '{{ fieldLabel }} muss >= {{ param }} sein.')
    expect(ruleValidator(value as any)).toBe('MyInt muss >= 5 sein.')
  })
})
