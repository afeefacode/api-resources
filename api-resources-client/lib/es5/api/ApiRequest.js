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
    fields(fields) {
        this._fields = fields;
        return this;
    }
    filters(filters) {
        this._filters = filters;
        return this;
    }
    send() {
        const params = this.toParams();
        if (this._lastRequestJSON === JSON.stringify(params)) {
            return this._lastRequest;
        }
        this._lastRequestJSON = JSON.stringify(params);
        const api = this._action.getApi();
        this._lastRequest = api.call(params);
        return this._lastRequest;
    }
    toParams() {
        return {
            resource: this._action.getResource().getName(),
            action: this._action.getName(),
            fields: this._fields,
            filters: this._filters
        };
    }
}
