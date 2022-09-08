import { Api } from './api/Api';
import { fields } from './field/fields';
import { filters } from './filter/filters';
import { Model } from './Model';
import { JsonObject } from './model/JsonObject';
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
        this.registerModel(JsonObject);
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
    getApi(type = this._defaultApiType) {
        if (type) {
            return this._apis[type] || null;
        }
        return null;
    }
    hasApi(type) {
        return !!this._apis[type];
    }
    createRequest({ apiType = null, resourceType, actionName }) {
        const action = this.getAction({
            apiType,
            resourceType,
            actionName
        });
        if (action) {
            return action.createRequest();
        }
        return null;
    }
    getAction({ apiType = null, resourceType, actionName }) {
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
        const validator = this._validators[type] || null;
        if (!validator) {
            console.warn(`No validator of type '${type}' registered.`);
        }
        return validator;
    }
    createFieldValidator(type, params = {}, rules = null) {
        const validator = this.getValidator(type);
        if (validator) {
            const fieldValidator = validator.createFieldValidator({ type, params });
            if (rules) {
                if (Array.isArray(rules)) {
                    rules.forEach(rule => {
                        fieldValidator.addRule(rule);
                    });
                }
                else {
                    fieldValidator.addRule(rules);
                }
            }
            return fieldValidator;
        }
        return null;
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
        const filter = this._filters[type] || null;
        if (!filter) {
            console.warn(`No filter of type '${type}' registered.`);
        }
        return filter;
    }
    registerType(typeName, type) {
        this._types[typeName] = type;
        return this;
    }
    getType(typeName) {
        if (!this._types[typeName]) {
            console.warn(`No type '${typeName}' registered.`);
        }
        return this._types[typeName] || null;
    }
}
export const apiResources = new ApiResources();
