import { Sanitizer } from './Sanitizer'

export class FieldSanitizer {
  public sanitizer: Sanitizer
  private _params: Record<string, unknown>

  constructor (sanitizer: Sanitizer, params: Record<string, unknown>) {
    this.sanitizer = sanitizer
    this._params = params
  }

  public get name (): string {
    return this.sanitizer.name
  }

  public get params (): unknown {
    return this.getParams()
  }

  public getParams (sanitizerName: string = this.sanitizer.name): unknown {
    if (this._params.hasOwnProperty(sanitizerName)) {
      return this._params[sanitizerName]
    }
    return this.sanitizer.default
  }
}
