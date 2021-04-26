import { Model } from '../../../Model';
export function OneRelationMixin(Relation) {
    return class OneRelationMixin extends Relation {
        deserialize(modelJSON) {
            return Model.create(modelJSON);
        }
        serialize(model) {
            return model.serialize();
        }
    };
}
