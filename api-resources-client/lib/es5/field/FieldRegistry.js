class FieldRegistry {
    constructor() {
        this._fields = {};
    }
    register(type, FieldClass) {
        this._fields[type] = FieldClass;
    }
    get(type) {
        return this._fields[type] || null;
    }
}
export const fieldRegistry = new FieldRegistry();
export function registerField(type, FieldClass) {
    return fieldRegistry.register(type, FieldClass);
}
export function getField(type) {
    return fieldRegistry.get(type);
}
