export class ApiRequest {
    constructor(json) {
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
        const api = this._action.getApi();
        return api.call(this.toParams());
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
