class TypeRegistry {
    constructor() {
        this._types = {};
    }
    register(type, TypeClass) {
        this._types[type] = TypeClass;
    }
    get(type) {
        return this._types[type] || null;
    }
}
export const typeRegistry = new TypeRegistry();
export function registerType(typeName, type) {
    return typeRegistry.register(typeName, type);
}
export function getType(typeName) {
    return typeRegistry.get(typeName);
}
