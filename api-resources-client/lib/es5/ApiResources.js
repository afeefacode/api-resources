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
        this.registerFields(fields);
        this.registerFilters(filters);
        this.registerValidators(validators);
    }
    schemasLoaded() {
        return Promise.all(this._schemasToLoad);
    }
    registerApi(name, baseUrl) {
        const api = new Api(baseUrl);
        this._apis[name] = api;
        const promise = api.loadSchema();
        this._schemasToLoad.push(promise);
        return this;
    }
    registerApis(apis) {
        for (const [name, baseUrl] of Object.entries(apis)) {
            this.registerApi(name, baseUrl);
        }
        return this;
    }
    getApi(name) {
        return this._apis[name] || null;
    }
    registerField(type, field) {
        this._fields[type] = field;
        this._fields.taset = field;
    }
    registerFields(fields) {
        for (const [type, field] of Object.entries(fields)) {
            this.registerField(type, field);
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
    registerFilter(type, filter) {
        this._filters[type] = filter;
    }
    registerFilters(filters) {
        for (const [type, filter] of Object.entries(filters)) {
            this.registerFilter(type, filter);
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
