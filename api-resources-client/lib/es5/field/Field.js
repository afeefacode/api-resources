import { apiResources } from '../ApiResources';
export class Field {
    constructor() {
        this._validator = null;
        this.type = this.constructor.type;
    }
    newInstance() {
        return new this.constructor();
    }
    createTypeField(name, json) {
        const field = this.newInstance();
        field.setupTypeFieldValidator(name, json.validator);
        return field;
    }
    getValidator() {
        return this._validator;
    }
    deserialize(value) {
        return value;
    }
    serialize(value) {
        return value;
    }
    setupTypeFieldValidator(fieldName, json) {
        if (json) {
            const validator = apiResources.getValidator(json.type);
            if (validator) {
                this._validator = validator.createFieldValidator(fieldName, json);
            }
        }
    }
}
