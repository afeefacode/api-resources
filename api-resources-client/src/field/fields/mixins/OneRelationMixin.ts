import { Model, ModelJSON } from '../../../Model'
import { Relation } from '../../Relation'

type RelationMixinConstructor = new (...args: any[]) => Relation

export function OneRelationMixin<TRelation extends RelationMixinConstructor> (Relation: TRelation): typeof Relation {
  return class OneRelationMixin extends Relation {
    public deserialize (modelJSON: ModelJSON): Model {
      return Model.create(modelJSON)
    }

    public serialize (model: Model): ModelJSON {
      return model.serialize()
    }
  }
}
