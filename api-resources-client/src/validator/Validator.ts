import { Rule, RuleJSON } from './Rule'

export type ValidatorJSON = {
  type: string,
  rules: Record<string, RuleJSON>
  params: Record<string, unknown>
}

export type RuleValidator = (value: unknown) => boolean | string

export class Validator {
  private _rules: Record<string, Rule> = {}
  private _params: Record<string, unknown> = {}
  private _fieldName!: string

  public setupRules (rules: Record<string, RuleJSON>): void {
    if (rules) {
      for (const [name, ruleJSON] of Object.entries(rules)) {
        const rule = new Rule(ruleJSON)
        this._rules[name] = rule
      }
    }
  }

  public createFieldValidator (fieldName: string, json: ValidatorJSON): Validator {
    const validator = new (this.constructor as { new (): Validator })()
    validator._fieldName = fieldName
    validator._rules = this._rules
    validator.setupParams(json.params)
    return validator
  }

  public getRules (): RuleValidator[] {
    return Object.keys(this._rules).map(name => {
      const rule = this._rules[name] as Rule
      return this.createRuleValidator(name, rule, this._params[name], this._fieldName)
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

  protected createRuleValidator (_ruleName: string, _rule: Rule, _params: unknown, _fieldName: string): RuleValidator {
    return (): boolean => true
  }
}
