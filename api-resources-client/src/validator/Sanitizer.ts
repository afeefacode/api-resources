export type SanitizerJSON = {
  default?: unknown
}

export class Sanitizer {
  public name: string
  public default: unknown

  constructor (name: string, json: SanitizerJSON) {
    this.name = name
    this.default = json.default || null
  }
}
