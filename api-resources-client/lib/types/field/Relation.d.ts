import { ModelAttributes } from '../Model.js';
import { RelatedType, RelatedTypeJSON } from '../type/RelatedType.js';
import { Field, FieldJSON, FieldJSONValue, FieldValue } from './Field.js';
type RelationJSON = FieldJSON & {
    related_type: RelatedTypeJSON;
};
export declare class Relation extends Field {
    static type: string;
    private _relatedType;
    createTypeField(json: RelationJSON): Relation;
    getRelatedType(): RelatedType;
    deserialize(value: FieldJSONValue): FieldValue;
    serialize(value: FieldValue, fields?: ModelAttributes | true): FieldJSONValue;
    protected fallbackDefault(): FieldValue;
}
export {};
//# sourceMappingURL=Relation.d.ts.map