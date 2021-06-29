import { apiResources } from '../ApiResources';
export class Type {
    constructor(name, json) {
        this._fields = {};
        this._updateFields = {};
        this._createFields = {};
        this._translations = {};
        this.name = name;
        for (const [key, value] of Object.entries(json.translations)) {
            this._translations[key] = value;
        }
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
    getTranslations() {
        return this._translations;
    }
    t(key) {
        return this._translations[key] || null;
    }
    getFields() {
        return this._fields;
    }
    getUpdateFields() {
        return this._updateFields;
    }
    getCreateFields() {
        return this._createFields;
    }
}
