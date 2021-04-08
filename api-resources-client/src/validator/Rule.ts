export type RuleJSON = {
  message: string
}

export class Rule {
  private _message: string

  constructor (json: RuleJSON) {
    this._message = json.message
  }
}
