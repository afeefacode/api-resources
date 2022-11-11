export type RuleJSON = {
  message: string,
  default?: unknown
}

export class Rule {
  public name: string
  private _message: string
  public default: unknown

  constructor (name: string, json: RuleJSON) {
    this.name = name
    this._message = json.message
    this.default = json.default || null
  }

  public getMessage (fieldLabel: string, param: unknown): string {
    const params: Record<string, unknown> = {
      fieldLabel,
      param
    }

    return this._message.replace(/{{\s*(\w+)\s*}}/g, function (placeholder: string, placeholderName: string): string {
      return String(params[placeholderName]) || placeholder
    })
  }
}
