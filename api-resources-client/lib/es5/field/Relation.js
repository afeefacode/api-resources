import { Field } from './Field';
export class Relation extends Field {
    constructor(json) {
        super(json);
        this._relatedType = json.related_type;
    }
}
