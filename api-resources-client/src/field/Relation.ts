import { Model, ModelJSON } from '../Model'
import { RelatedType, RelatedTypeJSON } from '../type/RelatedType'
import { Field, FieldJSON, FieldJSONValue, FieldValue } from './Field'

type RelationJSON = FieldJSON & {
  related_type: RelatedTypeJSON
}

export class Relation extends Field {
  public static type: string = 'Afeefa.Relation'

  private _relatedType!: RelatedType

  public createTypeField (json: RelationJSON): Relation {
    const relation = super.createTypeField(json) as Relation
    relation._relatedType = new RelatedType(json.related_type)
    return relation
  }

  public getRelatedType (): RelatedType {
    return this._relatedType
  }

  public deserialize (value: FieldJSONValue): FieldValue {
    if (this._relatedType.isList) {
      return (value as ModelJSON[]).map(modelJSON => Model.create(modelJSON))
    } else {
      if (value) {
        return Model.create(value as ModelJSON)
      }
      return null
    }
  }

  public serialize (value: FieldValue): FieldJSONValue {
    if (this._relatedType.isList) {
      if (this._relatedType.isLink) { // LinkMany
        return (value as Model[]).map(m => ({
          type: m.type,
          id: m.id
        }))
      } else { // HasMany
        return (value as Model[]).map(m => m.serialize())
      }
    } else {
      if (value) {
        if (this._relatedType.isLink) { // LinkOne
          const model = value as Model
          return {
            type: model.type,
            id: model.id
          }
        } else { // HasOne
          return (value as Model).serialize()
        }
      }
      return null
    }
  }
}
