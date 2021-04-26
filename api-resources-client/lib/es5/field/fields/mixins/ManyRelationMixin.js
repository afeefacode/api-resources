import { Model } from '../../../Model';
export function ManyRelationMixin(Relation) {
    return class ManyRelationMixin extends Relation {
        deserialize(modelsJSON) {
            return modelsJSON.map(modelJSON => Model.create(modelJSON));
        }
        serialize(models) {
            return models.map(m => m.serialize());
        }
    };
}
