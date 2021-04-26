import axios from 'axios';
import { ApiResponse } from './ApiResponse';
export class ApiRequest {
    constructor(json) {
        this._lastRequestJSON = '';
        if (json) {
            this._fields = json.fields;
            if (json.filters) {
                this._filters = json.filters;
            }
        }
    }
    action(action) {
        this._action = action;
        return this;
    }
    getAction() {
        return this._action;
    }
    fields(fields) {
        this._fields = fields;
        return this;
    }
    filters(filters) {
        this._filters = filters;
        return this;
    }
    send() {
        const params = this.serialize();
        if (this._lastRequestJSON === JSON.stringify(params)) {
            return this._lastRequest;
        }
        this._lastRequestJSON = JSON.stringify(params);
        const url = this._action.getApi().getBaseUrl();
        const request = axios.post(url, params)
            .then(result => {
            return new ApiResponse(new ApiRequest(), result);
        });
        this._lastRequest = request;
        return request;
    }
    serialize() {
        return {
            resource: this._action.getResource().getName(),
            action: this._action.getName(),
            fields: this._fields,
            filters: this._filters
        };
    }
}
