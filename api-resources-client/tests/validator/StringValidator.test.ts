import { FieldRule } from '../../src/validator/FieldRule'
import { FieldSanitizer } from '../../src/validator/FieldSanitizer'
import { Rule } from '../../src/validator/Rule'
import { Sanitizer } from '../../src/validator/Sanitizer'
import { RuleValidator, SanitizerFunction } from '../../src/validator/Validator'
import { StringValidator } from '../../src/validator/validators/StringValidator'

function createStringValidator (ruleName: string, params = {}, message: string = ''): RuleValidator<string | null> {
  const validator = new StringValidator()
  const rule = new Rule(ruleName, { message })
  const fieldRule = new FieldRule(rule, params, 'MyString')
  return validator.createRuleValidator(fieldRule)
}

function createStringSanitizer (sanitizerName: string, params = {}, json = {}): SanitizerFunction<string | null> {
  const validator = new StringValidator()
  const sanitizer = new Sanitizer(sanitizerName, json)
  const fieldSanitizer = new FieldSanitizer(sanitizer, params)
  return validator.createSanitizerFunction(fieldSanitizer)
}

describe('sanitizer trim', () => {
  test('trim default false', () => {
    const sanitizer = createStringSanitizer('trim')
    expect(sanitizer(' a   a ')).toBe(' a   a ')
  })

  test('trim default true', () => {
    const sanitizer = createStringSanitizer('trim', {}, {default: true})
    expect(sanitizer(' a   a ')).toBe('a   a')
  })

  test('trim', () => {
    const sanitizer = createStringSanitizer('trim', {trim: true})
    expect(sanitizer(' a   a ')).toBe('a   a')
  })
})

describe('sanitizer collapseWhite', () => {
  test('collapseWhite default false', () => {
    const sanitizer = createStringSanitizer('collapseWhite')
    expect(sanitizer('  a   a  ')).toBe('  a   a  ')
  })

  test('collapseWhite default true', () => {
    const sanitizer = createStringSanitizer('collapseWhite', {}, {default: true})
    expect(sanitizer('  a   a  ')).toBe(' a a ')
  })

  test('collapseWhite', () => {
    const sanitizer = createStringSanitizer('collapseWhite', {collapseWhite: true})
    expect(sanitizer('  a   a  ')).toBe(' a a ')
  })
})

describe('sanitizer emptyNull', () => {
  test('emptyNull default false', () => {
    const sanitizer = createStringSanitizer('emptyNull')
    expect(sanitizer('')).toBe('')
  })

  test('emptyNull default true', () => {
    const sanitizer = createStringSanitizer('emptyNull', {}, {default: true})
    expect(sanitizer('')).toBe(null)
  })

  test('emptyNull', () => {
    const sanitizer = createStringSanitizer('emptyNull', {emptyNull: true})
    expect(sanitizer('')).toBe(null)
  })
})

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
  '',
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
  'abcd'
])('min', value => {
  test('invalid min: ' + String(value), () => {
    const ruleValidator = createStringValidator('min', { min: 5 }, '{{ fieldLabel }} muss >= {{ param }} sein.')
    expect(ruleValidator(value)).toBe('MyString muss >= 5 sein.')
  })
})

describe.each([
  'a b c',
  'c a b',
  'c b a'
])('regex', value => {
  test('valid regex: ' + String(value), () => {
    const ruleValidator = createStringValidator('regex', { regex: /a/ }, '{{ fieldLabel }} muss ein {{ param }} enthalten.')
    expect(ruleValidator(value)).toBe(true)
  })
})

describe.each([
  '',
  null,
  'b'
])('regex', value => {
  test('invalid regex: ' + String(value), () => {
    const ruleValidator = createStringValidator('regex', { regex: /a/ }, '{{ fieldLabel }} muss ein {{ param }} enthalten.')
    expect(ruleValidator(value)).toBe('MyString muss ein /a/ enthalten.')
  })
})
