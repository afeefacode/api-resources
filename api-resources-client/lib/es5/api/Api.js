import axios from 'axios';
import { apiResources } from '../ApiResources';
import { Resource } from '../resource/Resource';
import { Type } from '../type/Type';
export class Api {
    constructor(baseUrl) {
        this._resources = {};
        this._types = {};
        this._validators = {};
        this._baseUrl = baseUrl;
    }
    getBaseUrl() {
        return this._baseUrl;
    }
    async loadSchema() {
        const result = await axios.get(`${this._baseUrl}/schema`);
        const schema = result.data;
        for (const [name, resourceJSON] of Object.entries(schema.resources)) {
            const resource = new Resource(this, name, resourceJSON);
            this._resources[name] = resource;
        }
        for (const [type, validatorJSON] of Object.entries(schema.validators)) {
            const validator = apiResources.getValidator(type);
            if (validator) {
                validator.setSanitizers(validatorJSON.sanitizers);
                validator.setRules(validatorJSON.rules);
                this._validators[type] = validator;
            }
        }
        for (const [typeName, typeJSON] of Object.entries(schema.types)) {
            const type = new Type(typeName, typeJSON);
            this._types[typeName] = type;
            apiResources.registerType(typeName, type);
        }
        return schema;
    }
    getResource(resourceType) {
        return this._resources[resourceType] || null;
    }
    getAction(resourceType, actionName) {
        const resource = this._resources[resourceType];
        if (!resource) {
            console.warn(`No resource '${resourceType}' configured.`);
            return null;
        }
        return resource.getAction(actionName);
    }
}
