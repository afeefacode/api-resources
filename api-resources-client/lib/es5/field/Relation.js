import { Field } from './Field';
export class Relation extends Field {
    createTypeField(name, json) {
        const relation = super.createTypeField(name, json);
        relation._relatedType = json.related_type;
        return relation;
    }
}
