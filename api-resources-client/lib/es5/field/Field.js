import { getValidator } from '../validator/ValidatorRegistry';
export class Field {
    constructor(json) {
        this._validator = null;
        if (json.validator) {
            const validator = getValidator(json.validator.type);
            if (validator) {
                this._validator = validator.createInstance(json.validator);
            }
        }
    }
}
