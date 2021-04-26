import { Api } from './api/Api';
import { fields } from './field/fields';
import { filters } from './filter/filters';
import { validators } from './validator/validators';
class ApiResources {
    constructor() {
        this._apis = {};
        this._models = {};
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
    registerField(field) {
        this._fields[field.type] = field;
        return this;
    }
    registerFields(fields) {
        for (const field of fields) {
            this.registerField(field);
        }
        return this;
    }
    getField(type) {
        return this._fields[type] || null;
    }
    registerModel(Model) {
        this._models[Model.type] = Model;
        return this;
    }
    registerModels(models) {
        for (const Model of models) {
            this.registerModel(Model);
        }
        return this;
    }
    getModel(type) {
        return this._models[type] || null;
    }
    registerValidator(type, validator) {
        this._validators[type] = validator;
        return this;
    }
    registerValidators(validators) {
        for (const [type, validator] of Object.entries(validators)) {
            this.registerValidator(type, validator);
        }
        return this;
    }
    getValidator(type) {
        return this._validators[type] || null;
    }
    registerFilter(filter) {
        this._filters[filter.type] = filter;
        return this;
    }
    registerFilters(filters) {
        for (const filter of filters) {
            this.registerFilter(filter);
        }
        return this;
    }
    getFilter(type) {
        return this._filters[type] || null;
    }
    registerType(typeName, type) {
        this._types[typeName] = type;
        return this;
    }
    getType(typeName) {
        return this._types[typeName] || null;
    }
}
export const apiResources = new ApiResources();
