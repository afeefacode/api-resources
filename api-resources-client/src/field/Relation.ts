import { Field, FieldJSON } from './Field'

type RelationJSON = FieldJSON & {
  related_type: string
}

export class Relation extends Field {
  private _relatedType!: string

  public createTypeField (name: string, json: RelationJSON): Relation {
    const relation = super.createTypeField(name, json) as Relation
    relation._relatedType = json.related_type
    return relation
  }
}
