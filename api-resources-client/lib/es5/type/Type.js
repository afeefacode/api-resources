import { apiResources } from '../ApiResources';
export class Type {
    constructor(json) {
        this._fields = {};
        this._updateFields = {};
        this._createFields = {};
        for (const [name, fieldJSON] of Object.entries(json.fields)) {
            const field = apiResources.getField(fieldJSON.type);
            if (field) {
                const typeField = field.createTypeField(fieldJSON);
                this._fields[name] = typeField;
            }
        }
        if (json.update_fields) {
            for (const [name, fieldJSON] of Object.entries(json.update_fields)) {
                const field = apiResources.getField(fieldJSON.type);
                if (field) {
                    const typeField = field.createTypeField(fieldJSON);
                    this._updateFields[name] = typeField;
                }
            }
        }
        if (json.create_fields) {
            for (const [name, fieldJSON] of Object.entries(json.create_fields)) {
                const field = apiResources.getField(fieldJSON.type);
                if (field) {
                    const typeField = field.createTypeField(fieldJSON);
                    this._createFields[name] = typeField;
                }
            }
        }
    }
}
