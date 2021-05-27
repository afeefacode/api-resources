import { Model } from '../../../Model';
export function OneRelationMixin(Relation) {
    return class OneRelationMixin extends Relation {
        deserialize(modelJSON) {
            if (modelJSON) {
                return Model.create(modelJSON);
            }
            return null;
        }
        serialize(model) {
            if (model) {
                return {
                    type: model.type,
                    id: model.id
                };
            }
            return null;
        }
    };
}
