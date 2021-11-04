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
            else {
                console.warn(`No Field implementation for field ${name} type ${fieldJSON.type}.`);
            }
        }
        if (json.update_fields) {
            for (const [name, fieldJSON] of Object.entries(json.update_fields)) {
                const field = apiResources.getField(fieldJSON.type);
                if (field) {
                    const typeField = field.createTypeField(fieldJSON);
                    this._updateFields[name] = typeField;
                }
                else {
                    console.warn(`No Field implementation for field ${name} type ${fieldJSON.type}.`);
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
                else {
                    console.warn(`No Field implementation for field ${name} type ${fieldJSON.type}.`);
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
    getField(name) {
        return this._fields[name] || null;
    }
    getUpdateFields() {
        return this._updateFields;
    }
    getUpdateField(name) {
        return this._updateFields[name] || null;
    }
    getCreateFields() {
        return this._createFields;
    }
    getCreateField(name) {
        return this._createFields[name] || null;
    }
}
