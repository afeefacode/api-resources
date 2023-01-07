import { ApiRequest } from '../api/ApiRequest';
import { apiResources } from '../ApiResources';
export class Field {
    constructor() {
        this._default = null;
        this._validator = null;
        this._options = [];
        this._optionsRequestFactory = null;
        this.type = this.constructor.type;
    }
    newInstance() {
        return new this.constructor();
    }
    createTypeField(json) {
        const field = this.newInstance();
        if (json.default) {
            field._default = json.default;
        }
        if (json.options_request) {
            const optionsRequest = json.options_request;
            const api = apiResources.getApi(optionsRequest.api);
            if (api) {
                field._optionsRequestFactory = () => {
                    const requestAction = api.getAction(optionsRequest.resource, optionsRequest.action);
                    return new ApiRequest(optionsRequest)
                        .action(requestAction);
                };
            }
        }
        if (json.options) {
            field._options = json.options;
        }
        field.setupFieldValidator(json.validator);
        return field;
    }
    getValidator() {
        return this._validator;
    }
    hasOptionsRequest() {
        return !!this._optionsRequestFactory;
    }
    createOptionsRequest() {
        if (this._optionsRequestFactory) {
            return this._optionsRequestFactory();
        }
        return null;
    }
    hasOptions() {
        return !!Object.keys(this._options).length;
    }
    getOptions() {
        return this._options;
    }
    default() {
        return this._default || this.fallbackDefault();
    }
    deserialize(value) {
        return value;
    }
    serialize(value) {
        return value;
    }
    fallbackDefault() {
        return null;
    }
    setupFieldValidator(json) {
        if (json) {
            const validator = apiResources.getValidator(json.type);
            if (validator) {
                this._validator = validator.createFieldValidator(json);
            }
            else {
                console.warn(`No field validator of type ${json.type}.`);
            }
        }
    }
}
