import axios from 'axios';
import { Request } from '../Request';
import { Resource } from '../resource/Resource';
import { Type } from '../type/Type';
import { registerType } from '../type/TypeRegistry';
import { getValidator } from '../validator/ValidatorRegistry';
export class Api {
    constructor(baseUrl) {
        this._resources = {};
        this._types = {};
        this._validators = {};
        this._baseUrl = baseUrl;
        void this.loadSchema();
    }
    getBaseUrl() {
        return this._baseUrl;
    }
    async loadSchema() {
        const result = await axios.get(`${this._baseUrl}/schema`);
        const schema = result.data;
        for (const [name, resourceJSON] of Object.entries(schema.resources)) {
            const resource = new Resource(resourceJSON);
            this._resources[name] = resource;
        }
        for (const [type, validatorJSON] of Object.entries(schema.validators)) {
            const validator = getValidator(type);
            if (validator) {
                validator.setup(validatorJSON);
                this._validators[type] = validator;
            }
        }
        for (const [typeName, typeJSON] of Object.entries(schema.types)) {
            const type = new Type(typeJSON);
            this._types[typeName] = type;
            registerType(typeName, type);
        }
        return schema;
    }
    request() {
        return new Request()
            .api(this);
    }
}
