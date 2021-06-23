import { Field, FieldJSON } from './Field'

type RelationJSON = FieldJSON & {
  related_type: string
}

export class Relation extends Field {
  private _relatedType!: string

  public createTypeField (json: RelationJSON): Relation {
    const relation = super.createTypeField(json) as Relation
    relation._relatedType = json.related_type
    return relation
  }

  public getRelatedType (): string {
    return this._relatedType
  }
}
