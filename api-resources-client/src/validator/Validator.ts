import { FieldRule } from './FieldRule'
import { FieldSanitizer } from './FieldSanitizer'
import { FieldValidator, FieldValidatorJSON } from './FieldValidator'
import { Rule, RuleJSON } from './Rule'
import { Sanitizer, SanitizerJSON } from './Sanitizer'

export type ValidatorJSON = {
  type: string
  sanitizers?: Record<string, SanitizerJSON>
  rules: Record<string, RuleJSON>
}

export type RuleValidator<T> = (value: T) => boolean | string
export type SanitizerFunction<T> = (value: T) => T

export class Validator<T=any> {
  protected _rules: Record<string, Rule> = {}
  protected _sanitizers: Record<string, Sanitizer> = {}

  public setSanitizers (sanitizers?: Record<string, SanitizerJSON>): void {
    if (sanitizers) {
      for (const [name, sanitizerJSON] of Object.entries(sanitizers)) {
        const sanitizer = new Sanitizer(name, sanitizerJSON)
        this._sanitizers[name] = sanitizer
      }
    }
  }

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

  public getSanitizers (): Record<string, Sanitizer> {
    return this._sanitizers
  }

  public getParamsWithDefaults (fieldParams: Record<string, unknown>): Record<string, unknown> {
    const params = {...fieldParams}

    for (const [ruleName, rule] of Object.entries(this._rules)) {
      if (!params.hasOwnProperty(ruleName)) {
        params[ruleName] = rule.default
      }
    }

    for (const [sanitizerName, sanitizer] of Object.entries(this._sanitizers)) {
      if (!params.hasOwnProperty(sanitizerName)) {
        params[sanitizerName] = sanitizer.default
      }
    }

    return params
  }

  public createRuleValidator (rule: FieldRule): RuleValidator<T> {
    if (rule.name === 'filled') {
      return value => {
        const filled = rule.params === true

        // filled and value is empty
        if (filled && !this.valueIsFilled(value)) {
          return rule.message
        }

        return true
      }
    }

    return (): boolean => true
  }

  public createSanitizerFunction (_sanitizer: FieldSanitizer): SanitizerFunction<T> {
    return (v): T => v
  }

  public getEmptyValue (_params: Record<string, unknown>): unknown {
    return null
  }

  public getMaxValueLength (_params: Record<string, unknown>): number | null {
    return null
  }

  protected valueIsFilled (value: T): boolean {
    return !!value
  }
}
