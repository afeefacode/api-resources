import { Model } from '../Model';
import { RelatedType } from '../type/RelatedType';
import { Field } from './Field';
export class Relation extends Field {
    createTypeField(json) {
        const relation = super.createTypeField(json);
        relation._relatedType = new RelatedType(json.related_type);
        return relation;
    }
    getRelatedType() {
        return this._relatedType;
    }
    deserialize(value) {
        if (this._relatedType.isList) {
            return value.map(modelJSON => Model.create(modelJSON));
        }
        else {
            if (value) {
                return Model.create(value);
            }
            return null;
        }
    }
    serialize(value) {
        if (this._relatedType.isList) {
            if (this._relatedType.isLink) { // LinkMany
                return value.map(m => ({
                    type: m.type,
                    id: m.id
                }));
            }
            else { // HasMany
                return value.map(m => m.serialize());
            }
        }
        else {
            if (value) {
                if (this._relatedType.isLink) { // LinkOne
                    const model = value;
                    return {
                        type: model.type,
                        id: model.id
                    };
                }
                else { // HasOne
                    return value.serialize();
                }
            }
            return null;
        }
    }
    fallbackDefault() {
        if (this._relatedType.isList) {
            return [];
        }
        return super.fallbackDefault();
    }
}
Relation.type = 'Afeefa.Relation';
