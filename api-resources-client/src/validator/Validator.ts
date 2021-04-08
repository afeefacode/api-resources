import { Rule, RuleJSON } from './Rule'

export type ValidatorJSON = {
  type: string,
  rules: Record<string, RuleJSON>
  params: Record<string, unknown>
}

export class Validator {
  private _rules: Record<string, Rule> = {}
  private _params: Record<string, unknown> = {}

  public setup (json: ValidatorJSON) {
    if (json.rules) {
      for (const [name, ruleJSON] of Object.entries(json.rules)) {
        const rule = new Rule(ruleJSON)
        this._rules[name] = rule
      }
    }
  }

  public createInstance (json: ValidatorJSON): Validator {
    const validator = new (this.constructor as { new (): Validator })()
    validator._rules = this._rules
    if (json.params) {
      for (const [name, paramJSON] of Object.entries(json.params)) {
        validator._params[name] = paramJSON
      }
    }
    return validator
  }
}
