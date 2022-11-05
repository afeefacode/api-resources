import { Rule } from './Rule'

export type RuleJSON = {
  message: string
}

export class FieldRule {
  public rule: Rule
  public fieldLabel: string
  private _params: Record<string, unknown>

  constructor (rule: Rule, params: Record<string, unknown>, fieldLabel: string) {
    this.rule = rule
    this._params = params
    this.fieldLabel = fieldLabel
  }

  public get name (): string {
    return this.rule.name
  }

  public get params (): unknown {
    return this.getParams()
  }

  public getParams (ruleName: string = this.rule.name): unknown {
    return this._params[ruleName]
  }

  public get message (): string {
    return this.rule.getMessage(this.fieldLabel, this.getParams())
  }
}
