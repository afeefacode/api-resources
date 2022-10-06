import { Rule } from './Rule'
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

    for (const [name, paramJSON] of Object.entries(json.params)) {
      this._params[name] = paramJSON
    }
  }

  public getParams (): Record<string, unknown> {
    return this._params
  }

  public param (name: string): unknown {
    return this._params[name]
  }

  public getRules (fieldLabel: string): RuleValidator<T>[] {
    const rules = this._validator.getRules()
    return [
      ...Object.keys(rules).map(name => {
        return this.createRuleValidator(fieldLabel, name, rules[name]!, this._params[name])
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


  protected createRuleValidator (fieldLabel: string, ruleName: string, rule: Rule, params: unknown): RuleValidator<T> {
    return this._validator.createRuleValidator(fieldLabel, ruleName, rule, params)
  }
}
