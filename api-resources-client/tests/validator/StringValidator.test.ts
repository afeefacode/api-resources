import { FieldRule } from '../../src/validator/FieldRule'
import { Rule } from '../../src/validator/Rule'
import { RuleValidator } from '../../src/validator/Validator'
import { StringValidator } from '../../src/validator/validators/StringValidator'

function createStringValidator (ruleName: string, params = {}, message: string = ''): RuleValidator<string | null> {
  const validator = new StringValidator()
  const rule = new Rule(ruleName, { message })
  const fieldRule = new FieldRule(rule, params, 'MyString')
  return validator.createRuleValidator(fieldRule)
}

describe.each([
  null,
  '',
  'test',
  'and',
  'if',
  '1111'
])('string', value => {
  test('valid string: ' + String(value), () => {
    const ruleValidator = createStringValidator('string')
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  1111,
  [],
  this,
  () => {}
])('string', value => {
  test('invalid string: ' + String(value), () => {
    const ruleValidator = createStringValidator('string', {}, '{{ fieldLabel }} must be String.')
    expect(ruleValidator(value as any)).toBe('MyString must be String.')
  })
})

describe.each([
  'a',
  'and'
])('filled', value => {
  test('valid filled: ' + String(value), () => {
    const ruleValidator = createStringValidator('filled', { filled: true })
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  '',
  null
])('filled', value => {
  test('invalid filled: ' + String(value), () => {
    const ruleValidator = createStringValidator('filled', { filled: true }, '{{ fieldLabel }} muss ausgefüllt sein.')
    expect(ruleValidator(value)).toBe('MyString muss ausgefüllt sein.')
  })
})

describe.each([
  '',
  'test',
  null
])('null', value => {
  test('valid null: ' + String(value), () => {
    const ruleValidator = createStringValidator('null', { null: true })
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  null
])('null', value => {
  test('invalid null: ' + String(value), () => {
    const ruleValidator = createStringValidator('null', {}, '{{ fieldLabel }} darf nicht null sein.')
    expect(ruleValidator(value)).toBe('MyString darf nicht null sein.')
  })
})

describe.each([
  'abcde',
  'abcd',
  '',
  null
])('max', value => {
  test('valid max: ' + String(value), () => {
    const ruleValidator = createStringValidator('max', { max: 5 })
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  'abcdef'
])('max', value => {
  test('invalid max: ' + String(value), () => {
    const ruleValidator = createStringValidator('max', { max: 5 }, '{{ fieldLabel }} muss <= {{ param }} sein.')
    expect(ruleValidator(value)).toBe('MyString muss <= 5 sein.')
  })
})

describe.each([
  null,
  'abcde',
  'abcdef'
])('min', value => {
  test('valid min: ' + String(value), () => {
    const ruleValidator = createStringValidator('min', { min: 5 })
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  'abcd',
  ''
])('min', value => {
  test('invalid min: ' + String(value), () => {
    const ruleValidator = createStringValidator('min', { min: 5 }, '{{ fieldLabel }} muss >= {{ param }} sein.')
    expect(ruleValidator(value)).toBe('MyString muss >= 5 sein.')
  })
})
