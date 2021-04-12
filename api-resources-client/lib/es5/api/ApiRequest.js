export class ApiRequest {
    constructor() {
        this._fields = {};
        this._filters = {};
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
