import { Field } from './Field';
export class Relation extends Field {
    createTypeField(json) {
        const relation = super.createTypeField(json);
        relation._relatedType = json.related_type;
        return relation;
    }
}
