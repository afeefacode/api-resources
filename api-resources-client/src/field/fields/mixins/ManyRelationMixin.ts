import { Model, ModelJSON } from '../../../Model'
import { Relation } from '../../Relation'

type RelationMixinConstructor = new (...args: any[]) => Relation

export function ManyRelationMixin<TRelation extends RelationMixinConstructor> (Relation: TRelation): typeof Relation {
  return class ManyRelationMixin extends Relation {
    public deserialize (modelsJSON: ModelJSON[]): Model[] {
      return modelsJSON.map(modelJSON => Model.create(modelJSON))
    }

    public serialize (models: Model[]): ModelJSON[] {
      return models.map(m => m.serialize())
    }
  }
}
