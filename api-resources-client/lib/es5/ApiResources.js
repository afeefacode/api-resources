import { Api } from './api/Api';
import { fields } from './field/fields';
import { filters } from './filter/filters';
import { validators } from './validator/validators';
class ApiResources {
    constructor() {
        this._apis = {};
        this._fields = {};
        this._validators = {};
        this._filters = {};
        this._types = {};
        this._schemasToLoad = [];
        this._schmemaLoadCount = 0;
        this.registerFields(fields);
        this.registerFilters(filters);
        this.registerValidators(validators);
    }
    get isLoaded() {
        return this._schmemaLoadCount === this._schemasToLoad.length;
    }
    loaded() {
        return Promise.all(this._schemasToLoad);
    }
    registerApi(name, baseUrl) {
        const api = new Api(baseUrl);
        this._apis[name] = api;
        const promise = api.loadSchema().then(result => {
            this._schmemaLoadCount++;
            return result;
        });
        this._schemasToLoad.push(promise);
        return api;
    }
    registerApis(apis) {
        for (const [name, baseUrl] of Object.entries(apis)) {
            this.registerApi(name, baseUrl);
        }
    }
    getApi(name) {
        return this._apis[name] || null;
    }
    setup() {
        const promises = Object.values(this._apis)
            .map(a => a.loadSchema());
        return Promise.all(promises);
    }
    registerField(type, FieldClass) {
        this._fields[type] = FieldClass;
        this._fields.taset = FieldClass;
    }
    registerFields(fields) {
        for (const [type, FieldClass] of Object.entries(fields)) {
            this.registerField(type, FieldClass);
        }
    }
    getField(type) {
        return this._fields[type] || null;
    }
    registerValidator(type, validator) {
        this._validators[type] = validator;
    }
    registerValidators(validators) {
        for (const [type, validator] of Object.entries(validators)) {
            this.registerValidator(type, validator);
        }
    }
    getValidator(type) {
        return this._validators[type] || null;
    }
    registerFilter(type, FilterClass) {
        this._filters[type] = FilterClass;
    }
    registerFilters(filters) {
        for (const [type, FilterClass] of Object.entries(filters)) {
            this.registerFilter(type, FilterClass);
        }
    }
    getFilter(type) {
        return this._filters[type] || null;
    }
    registerType(typeName, type) {
        this._types[typeName] = type;
    }
    getType(typeName) {
        return this._types[typeName] || null;
    }
}
export const apiResources = new ApiResources();
