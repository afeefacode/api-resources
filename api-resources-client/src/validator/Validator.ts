import { Rule, RuleJSON } from './Rule'

export type ValidatorJSON = {
  type: string,
  rules: Record<string, RuleJSON>
  params: Record<string, unknown>
}

export class Validator {
  private _rules: Record<string, Rule> = {}
  private _params: Record<string, unknown> = {}

  public setupRules (rules: Record<string, RuleJSON>): void {
    if (rules) {
      for (const [name, ruleJSON] of Object.entries(rules)) {
        const rule = new Rule(ruleJSON)
        this._rules[name] = rule
      }
    }
  }

  public createFieldValidator (json: ValidatorJSON): Validator {
    const validator = new (this.constructor as { new (): Validator })()
    validator._rules = this._rules
    validator.setupParams(json.params)
    return validator
  }

  protected setupParams (params: Record<string, unknown>): void {
    if (params) {
      for (const [name, paramJSON] of Object.entries(params)) {
        this._params[name] = paramJSON
      }
    }
  }
}
