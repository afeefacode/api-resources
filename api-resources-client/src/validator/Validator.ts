import { Rule, RuleJSON } from './Rule'

export type ValidatorJSON = {
  type: string
  rules: Record<string, RuleJSON>
  params: Record<string, unknown>
}

export type RuleValidator<T> = (value: T) => boolean | string

export class Validator<T=any> {
  protected _rules: Record<string, Rule> = {}
  protected _params: Record<string, unknown> = {}

  public setupRules (rules: Record<string, RuleJSON>): void {
    if (rules) {
      for (const [name, ruleJSON] of Object.entries(rules)) {
        const rule = new Rule(ruleJSON)
        this._rules[name] = rule
      }
    }
  }

  public createFieldValidator (json: ValidatorJSON): Validator<T> {
    const validator = new (this.constructor as { new (): Validator<T> })()
    validator._rules = this._rules
    validator.setupParams(json.params)
    return validator
  }

  public getRules (fieldLabel: string): RuleValidator<T>[] {
    return Object.keys(this._rules).map(name => {
      const rule = this._rules[name] as Rule
      return this.createRuleValidator(fieldLabel, name, rule, this._params[name])
    })
  }

  public getParams (): Record<string, unknown> {
    return this._params
  }

  protected setupParams (params: Record<string, unknown>): void {
    if (params) {
      for (const [name, paramJSON] of Object.entries(params)) {
        this._params[name] = paramJSON
      }
    }
  }

  protected createRuleValidator (_fieldLabel: string, _ruleName: string, _rule: Rule, _params: unknown): RuleValidator<T> {
    return (): boolean => true
  }
}
