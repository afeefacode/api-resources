import { FieldRule } from './FieldRule'
import { FieldValidator, FieldValidatorJSON } from './FieldValidator'
import { Rule, RuleJSON } from './Rule'

export type ValidatorJSON = {
  type: string
  rules: Record<string, RuleJSON>
}

export type RuleValidator<T> = (value: T) => boolean | string

export class Validator<T=any> {
  protected _rules: Record<string, Rule> = {}

  public setRules (rules: Record<string, RuleJSON>): void {
    if (rules) {
      for (const [name, ruleJSON] of Object.entries(rules)) {
        const rule = new Rule(name, ruleJSON)
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

  public getParamsWithDefaults (params: Record<string, unknown>): Record<string, unknown> {
    return Object.entries(this._rules).reduce((params, [ruleName, rule]) => {
      if (!params.hasOwnProperty(ruleName)) {
        params[ruleName] = rule.default
      }
      return params
    }, params)
  }

  public createRuleValidator (_rule: FieldRule): RuleValidator<T> {
    return (): boolean => true
  }

  public getEmptyValue (_params: Record<string, unknown>): unknown {
    return null
  }

  public getMaxValueLength (_params: Record<string, unknown>): number | null {
    return null
  }
}
