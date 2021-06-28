export type ActionParamJSON = {
  type: string
  [key: string]: unknown
}

export class ActionParam {
  private _type: string
  private _values: Record<string, any> = {}

  constructor (json: ActionParamJSON) {
    this._type = json.type

    for (const [key, value] of Object.entries(json)) {
      this._values[key] = value
    }
  }

  public getType (): string {
    return this._type
  }
}
