import axios from 'axios';
import { ApiResponse } from './ApiResponse';
export class ApiRequest {
    // private _lastRequestJSON: string = ''
    // private _lastRequest!: Promise<ApiResponse | boolean>
    constructor(json) {
        this._fields = {};
        if (json) {
            this._fields = json.fields;
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
    filters(filters) {
        this._filters = filters;
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
        const urlResourceName = this._action.getResource().getName().replace(/.+\./, '').replace(/Resource/, '');
        let url = this._action.getApi().getBaseUrl() + '?' + urlResourceName + ':' + this._action.getName();
        if (this._params && this._params.id) {
            url += ':' + this._params.id;
        }
        const axiosResponse = axios.post(url, params)
            .then(result => {
            return new ApiResponse(new ApiRequest(), result);
        })
            .catch((error) => {
            console.error(error);
            return false;
        });
        // this._lastRequest = request
        return axiosResponse;
    }
    serialize() {
        return {
            resource: this._action.getResource().getName(),
            action: this._action.getName(),
            params: this._params,
            fields: this._fields,
            filters: this._filters,
            data: this._data
        };
    }
}
