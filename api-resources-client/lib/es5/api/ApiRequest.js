import axios from 'axios';
import { ApiError } from './ApiError';
import { ApiResponse } from './ApiResponse';
export class ApiRequest {
    // private _lastRequestJSON: string = ''
    // private _lastRequest!: Promise<ApiResponse | boolean>
    constructor(json) {
        this._fields = {};
        if (json) {
            this._fields = json.fields;
            if (json.scopes) {
                this._scopes = json.scopes;
            }
            if (json.filters) {
                this._filters = json.filters;
            }
            if (json.params) {
                this._params = json.params;
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
    addField(name, value) {
        this._fields[name] = value;
        return this;
    }
    addFields(fields) {
        this._fields = Object.assign(Object.assign({}, this._fields), fields);
        return this;
    }
    scopes(scopes) {
        this._scopes = scopes;
        return this;
    }
    filters(filters) {
        this._filters = filters;
        return this;
    }
    addFilter(name, value) {
        this._filters[name] = value;
        return this;
    }
    addFilters(filters) {
        this._filters = Object.assign(Object.assign({}, this._filters), filters);
        return this;
    }
    params(params) {
        this._params = params;
        return this;
    }
    data(data) {
        this._data = data;
        return this;
    }
    send() {
        const params = this.serialize();
        // if (this._lastRequestJSON === JSON.stringify(params)) {
        //   return this._lastRequest
        // }
        // this._lastRequestJSON = JSON.stringify(params)
        const urlResourceType = this._action.getResource().getName().replace(/.+\./, '').replace(/Resource/, '');
        let url = this._action.getApi().getBaseUrl() + '?' + urlResourceType + ':' + this._action.getName();
        if (this._params && this._params.id) {
            url += ':' + this._params.id;
        }
        const axiosResponse = axios.post(url, params)
            .then(result => {
            return new ApiResponse(this, result);
        })
            .catch((error) => {
            console.error(error);
            return new ApiError(this, error);
        });
        // this._lastRequest = request
        return axiosResponse;
    }
    serialize() {
        return {
            resource: this._action.getResource().getName(),
            action: this._action.getName(),
            params: this._params,
            scopes: this._scopes,
            filters: this._filters,
            fields: this._fields,
            data: this._data
        };
    }
}
