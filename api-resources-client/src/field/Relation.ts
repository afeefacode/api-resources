import { Field, FieldJSON } from './Field'

type RelationJSON = FieldJSON & {
  related_type: string
}

export class Relation extends Field {
  private _relatedType: string

  constructor (json: RelationJSON) {
    super(json)

    this._relatedType = json.related_type
  }
}
