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
            const modelsJsons = value;
            return modelsJsons.map(modelJSON => {
                // if json does not contain type information, take first type of relation schema
                if (!modelJSON.type) {
                    if (this._relatedType.types.length > 1) {
                        console.warn('Deserialize relation json without type information. Took first type found, but there are more.');
                    }
                    modelJSON.type = this._relatedType.types[0];
                }
                return Model.fromJson(modelJSON);
            });
        }
        else {
            const modelJSON = value;
            if (modelJSON) {
                // if json does not contain type information, take first type of relation schema
                if (!modelJSON.type) {
                    if (this._relatedType.types.length > 1) {
                        console.warn('Deserialize relation json without type information. Took first type found, but there are more.');
                    }
                    modelJSON.type = this._relatedType.types[0];
                }
                return Model.fromJson(modelJSON);
            }
            return null;
        }
    }
    serialize(value, fields) {
        fields = fields === true ? undefined : fields; // don't pass relation: true further down
        if (this._relatedType.isList) {
            if (!value) {
                value = this.default();
            }
            if (this._relatedType.isLink) { // LinkMany
                return value.map(m => ({
                    type: m.type,
                    id: m.id
                }));
            }
            else { // HasMany
                return value.map(m => m.serialize(fields));
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
                    return value.serialize(fields);
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
