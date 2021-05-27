import { Model, ModelJSON } from '../../../Model'
import { Relation } from '../../Relation'

type RelationMixinConstructor = new (...args: any[]) => Relation

export function OneRelationMixin<TRelation extends RelationMixinConstructor> (Relation: TRelation): typeof Relation {
  return class OneRelationMixin extends Relation {
    public deserialize (modelJSON: ModelJSON | null): Model | null {
      if (modelJSON) {
        return Model.create(modelJSON)
      }
      return null
    }

    public serialize (model: Model | null): ModelJSON | null {
      if (model) {
        return {
          type: model.type,
          id: model.id
        }
      }
      return null
    }
  }
}
