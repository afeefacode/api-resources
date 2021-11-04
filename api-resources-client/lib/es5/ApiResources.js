import { Api } from './api/Api';
import { fields } from './field/fields';
import { filters } from './filter/filters';
import { Model } from './Model';
import { validators } from './validator/validators';
class ApiResources {
    constructor() {
        this._apis = {};
        this._defaultApiType = null;
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
    registerApi(type, baseUrl) {
        const api = new Api(baseUrl);
        this._apis[type] = api;
        if (!this._defaultApiType) {
            this.defaultApi(type);
        }
        const promise = api.loadSchema();
        this._schemasToLoad.push(promise);
        return this;
    }
    registerApis(apis) {
        for (const [type, baseUrl] of Object.entries(apis)) {
            this.registerApi(type, baseUrl);
        }
        return this;
    }
    defaultApi(type) {
        if (this.hasApi(type)) {
            this._defaultApiType = type;
        }
        else {
            console.warn(`No api configured for type ${type}.`);
        }
        return this;
    }
    getApi(type) {
        return this._apis[type] || null;
    }
    hasApi(type) {
        return !!this._apis[type];
    }
    createRequest({ api: apiType = null, resource: resourceType, action: actionName }) {
        const action = this.getAction({
            api: apiType,
            resource: resourceType,
            action: actionName
        });
        if (action) {
            return action.createRequest();
        }
        return null;
    }
    getAction({ api: apiType = null, resource: resourceType, action: actionName }) {
        apiType = apiType || this._defaultApiType;
        if (!apiType) {
            console.warn('No default api configured.');
            return null;
        }
        if (!this.hasApi(apiType)) {
            console.warn(`No api '${apiType}' configured.`);
            return null;
        }
        const api = this.getApi(apiType);
        const action = api.getAction(resourceType, actionName);
        if (!action) {
            console.warn(`No action '${actionName}' found for resource '${resourceType}'.`);
            return null;
        }
        return action;
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
    getModelClass(type) {
        return this._models[type] || Model;
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
