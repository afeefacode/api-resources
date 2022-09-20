import axios from 'axios';
import { ApiError } from './ApiError';
import { ApiResponse } from './ApiResponse';
export class ApiRequest {
    // private _lastRequestJSON: string = ''
    // private _lastRequest!: Promise<ApiResponse | boolean>
    constructor(json) {
        if (json) {
            if (json.params) {
                this._params = json.params;
            }
            if (json.filters) {
                this._filters = json.filters;
            }
            if (json.fields) {
                this._fields = json.fields;
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
    params(params) {
        this._params = params;
        return this;
    }
    addParam(name, value) {
        this.params(this._params || {});
        this._params[name] = value;
        return this;
    }
    addParams(params) {
        this._params = Object.assign(Object.assign({}, (this._params || {})), params);
        return this;
    }
    getParams() {
        return this._params;
    }
    fields(fields) {
        this._fields = fields;
        return this;
    }
    addField(name, value) {
        this.fields(this._fields || {});
        this._fields[name] = value;
        return this;
    }
    getFields() {
        return this._fields;
    }
    filters(filters) {
        this._filters = filters;
        return this;
    }
    addFilter(name, value) {
        this.filters(this._filters || {});
        this._filters[name] = value;
        return this;
    }
    addFilters(filters) {
        this._filters = Object.assign(Object.assign({}, (this._filters || {})), filters);
        return this;
    }
    getFilters() {
        return this._filters;
    }
    data(data) {
        this._data = data;
        return this;
    }
    send() {
        const params = this.serialize();
        const urlResourceType = this._action.getResource().getType().replace(/.+\./, '').replace(/Resource/, '');
        let url = this._action.getApi().getBaseUrl() + '?' + urlResourceType + ':' + this._action.getName();
        if (this._params && this._params.id) {
            url += ':' + this._params.id;
        }
        if (this._fields) {
            url += ':' + (Object.keys(this._fields).join(','));
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
        const json = {
            resource: this._action.getResource().getType(),
            action: this._action.getName()
        };
        if (this._fields) {
            json.fields = this._fields;
        }
        if (this._params) {
            json.params = this._params;
        }
        if (this._filters) {
            json.filters = this._filters;
        }
        if (this._data || this._data === null) {
            json.data = this._data;
        }
        return json;
    }
}
