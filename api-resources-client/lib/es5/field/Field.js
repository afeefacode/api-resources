import { apiResources } from '../ApiResources';
export class Field {
    constructor() {
        this._validator = null;
        this.type = this.constructor.type;
    }
    newInstance() {
        return new this.constructor();
    }
    createTypeField(json) {
        const field = this.newInstance();
        field.setupTypeFieldValidator(json.validator);
        return field;
    }
    getValidator() {
        return this._validator;
    }
    default() {
        return null;
    }
    deserialize(value) {
        return value;
    }
    serialize(value) {
        return value;
    }
    setupTypeFieldValidator(json) {
        if (json) {
            const validator = apiResources.getValidator(json.type);
            if (validator) {
                this._validator = validator.createFieldValidator(json);
            }
            else {
                console.warn('No field validator of type', json.type);
            }
        }
    }
}
