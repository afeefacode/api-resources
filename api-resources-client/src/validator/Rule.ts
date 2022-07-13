export type RuleJSON = {
  message: string
}

export class Rule {
  private _message: string

  constructor (json: RuleJSON) {
    this._message = json.message
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
