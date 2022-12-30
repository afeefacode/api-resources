import { FieldRule } from './FieldRule'
import { FieldSanitizer } from './FieldSanitizer'
import { RuleValidator, SanitizerFunction, Validator } from './Validator'

export type FieldValidatorJSON = {
  type: string
  params: Record<string, unknown>
}

export class FieldValidator<T=any> {
  private _validator: Validator<T>
  private _params: Record<string, unknown> = {}
  private _additionalRules: RuleValidator<T>[] = []

  constructor (validator: Validator<T>, json: FieldValidatorJSON) {
    this._validator = validator

    for (const [ruleName, paramJSON] of Object.entries(json.params)) {
      this._params[ruleName] = paramJSON
    }
  }

  public getParams (): Record<string, unknown> {
    return this._params
  }

  public getParam (ruleName: string): unknown {
    return this._params[ruleName]
  }

  public getRules (fieldLabel: string): RuleValidator<T>[] {
    const rules = this._validator.getRules()
    return [
      ...Object.keys(rules).map(ruleName => {
        const rule = rules[ruleName]!
        return this.createRuleValidator(new FieldRule(rule, this._params, fieldLabel))
      }),
      ...this._additionalRules
    ]
  }

  public getSanitizers (): SanitizerFunction<T>[] {
    const sanitizers = this._validator.getSanitizers()
    return Object.values(sanitizers).map(sanitizer => {
      const fieldSanitizer = new FieldSanitizer(sanitizer, this._params)
      return this._validator.createSanitizerFunction(fieldSanitizer)
    })
  }

  public addAdditionalRule (rule: RuleValidator<T>): FieldValidator {
    this._additionalRules.push(rule)
    return this
  }

  public setAdditionalRules (rules: RuleValidator<T>[]): FieldValidator {
    this._additionalRules = rules
    return this
  }

  public getMaxValueLength (): number | null {
    const params = this._validator.getParamsWithDefaults(this._params)
    return this._validator.getMaxValueLength(params)
  }

  protected createRuleValidator (rule: FieldRule): RuleValidator<T> {
    return this._validator.createRuleValidator(rule)
  }
}
