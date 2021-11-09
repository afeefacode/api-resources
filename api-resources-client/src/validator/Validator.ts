import { FieldValidator, FieldValidatorJSON } from './FieldValidator'
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

  public setRules (rules: Record<string, RuleJSON>): void {
    if (rules) {
      for (const [name, ruleJSON] of Object.entries(rules)) {
        const rule = new Rule(ruleJSON)
        this._rules[name] = rule
      }
    }
  }

  public createFieldValidator (json: FieldValidatorJSON): FieldValidator<T> {
    return new FieldValidator<T>(this, json)
  }

  public getRules (): Record<string, Rule> {
    return this._rules
  }

  public createRuleValidator (_fieldLabel: string, _ruleName: string, _rule: Rule, _params: unknown): RuleValidator<T> {
    return (): boolean => true
  }
}
