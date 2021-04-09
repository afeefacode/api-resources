import { apiResources } from '../ApiResources';
export class Field {
    constructor() {
        this._validator = null;
    }
    createTypeField(json) {
        const field = new this.constructor();
        field.setupTypeFieldValidator(json.validator);
        return field;
    }
    setupTypeFieldValidator(json) {
        if (json) {
            const validator = apiResources.getValidator(json.type);
            if (validator) {
                this._validator = validator.createFieldValidator(json);
            }
        }
    }
}
