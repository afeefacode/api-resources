class ValidatorRegistry {
    constructor() {
        this._validators = {};
    }
    register(type, validator) {
        this._validators[type] = validator;
    }
    get(type) {
        return this._validators[type] || null;
    }
}
export const validatorRegistry = new ValidatorRegistry();
export function registerValidator(type, validator) {
    return validatorRegistry.register(type, validator);
}
export function getValidator(type) {
    return validatorRegistry.get(type);
}
