import { apiResources } from '../ApiResources';
export class Type {
    constructor(json) {
        this._fields = {};
        this._updateFields = {};
        this._createFields = {};
        for (const [name, fieldJSON] of Object.entries(json.fields)) {
            const FieldClass = apiResources.getField(fieldJSON.type);
            if (FieldClass) {
                const field = new FieldClass(fieldJSON);
                this._fields[name] = field;
            }
        }
        if (json.update_fields) {
            for (const [name, fieldJSON] of Object.entries(json.update_fields)) {
                const FieldClass = apiResources.getField(fieldJSON.type);
                if (FieldClass) {
                    const field = new FieldClass(fieldJSON);
                    this._updateFields[name] = field;
                }
            }
        }
        if (json.create_fields) {
            for (const [name, fieldJSON] of Object.entries(json.create_fields)) {
                const FieldClass = apiResources.getField(fieldJSON.type);
                if (FieldClass) {
                    const field = new FieldClass(fieldJSON);
                    this._createFields[name] = field;
                }
            }
        }
    }
}
