import { FieldValidator } from '../../src/validator/FieldValidator'
import { RuleValidator } from '../../src/validator/Validator'
import { StringValidator } from '../../src/validator/validators/StringValidator'

function createFieldValidator (params: Record<string, unknown>): FieldValidator<string | null> {
  const validator = new StringValidator()
  validator.setRules({
    filled: {message: '{{ fieldLabel }} muss ausgefüllt sein.'},
    max: {message: '{{ fieldLabel }} ist zu lang.'}
  })
  return validator.createFieldValidator({type: 'Afeefa.StringValidator', params})
}

describe('validate', () => {
  test('gültiger Wert ergibt true', () => {
    const fieldValidator = createFieldValidator({filled: true, max: 5})
    expect(fieldValidator.validate('abc', 'Titel')).toBe(true)
  })

  test('erste verletzte Regel liefert ihre Meldung', () => {
    const fieldValidator = createFieldValidator({filled: true, max: 5})
    expect(fieldValidator.validate('', 'Titel')).toBe('Titel muss ausgefüllt sein.')
  })

  test('auch eine spätere Regel greift', () => {
    const fieldValidator = createFieldValidator({filled: true, max: 5})
    expect(fieldValidator.validate('abcdef', 'Titel')).toBe('Titel ist zu lang.')
  })

  test('ohne Regeln ist jeder Wert gültig', () => {
    const fieldValidator = createFieldValidator({})
    expect(fieldValidator.validate('', 'Titel')).toBe(true)
  })

  test('eine eigene Regel wird mitgeprüft', () => {
    const fieldValidator = createFieldValidator({})
    const eigene: RuleValidator<string | null> = value => value === 'nein' ? 'Nicht nein.' : true
    fieldValidator.addAdditionalRule(eigene)
    expect(fieldValidator.validate('nein', 'Titel')).toBe('Nicht nein.')
    expect(fieldValidator.validate('ja', 'Titel')).toBe(true)
  })

  test('fieldLabel landet in der Meldung', () => {
    const fieldValidator = createFieldValidator({filled: true})
    expect(fieldValidator.validate('', 'E-Mail')).toBe('E-Mail muss ausgefüllt sein.')
  })
})
