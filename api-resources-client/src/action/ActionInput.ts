export class ActionInput {
  private _type: string

  constructor (type: string) {
    this._type = type
  }

  public getType (): string {
    return this._type
  }
}
