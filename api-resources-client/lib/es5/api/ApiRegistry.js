import '../filter/filters';
import '../validator/validators';
import '../field/fields';
import { Api } from './Api';
class ApiRegistry {
    constructor() {
        this._apis = {};
    }
    register(name, baseUrl) {
        const api = new Api(baseUrl);
        this._apis[name] = api;
        return api;
    }
    get(name) {
        return this._apis[name] || null;
    }
}
export const apiRegistry = new ApiRegistry();
export function registerApi(name, baseUrl) {
    return apiRegistry.register(name, baseUrl);
}
export function getApi(name) {
    return apiRegistry.get(name);
}
