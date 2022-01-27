export type RelatedTypeJSON = {
  type: string
  types: string[]
  link: boolean
  list: boolean
}

export class RelatedType {
  public types: string[] = []
  public isList = false
  public isLink = false

  constructor (json: RelatedTypeJSON) {
    if (json.type) {
      this.types = [json.type]
    } else {
      this.types = json.types
    }
    this.isLink = json.link || false
    this.isList = json.list || false
  }
}
