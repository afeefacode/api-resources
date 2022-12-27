import { FieldRule } from './FieldRule'
import { RuleValidator, Validator } from './Validator'

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

  public addAdditionalRule (rule: RuleValidator<T>): FieldValidator {
    this._additionalRules.push(rule)
    return this
  }

  public setAdditionalRules (rules: RuleValidator<T>[]): FieldValidator {
    this._additionalRules = rules
    return this
  }

  public getEmptyValue (): unknown {
    const params = this._validator.getParamsWithDefaults(this._params)
    return this._validator.getEmptyValue(params)
  }

  public getMaxValueLength (): number | null {
    const params = this._validator.getParamsWithDefaults(this._params)
    return this._validator.getMaxValueLength(params)
  }

  protected createRuleValidator (rule: FieldRule): RuleValidator<T> {
    return this._validator.createRuleValidator(rule)
  }
}
