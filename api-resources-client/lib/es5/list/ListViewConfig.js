import { apiResources } from '../ApiResources';
export class ListViewConfig {
    constructor() {
        this._fields = {};
        this._params = {};
        this._filters = {};
    }
    action({ apiType = null, resourceType, actionName }) {
        this._action = apiResources.getAction({
            api: apiType,
            resource: resourceType,
            action: actionName
        });
        return this;
    }
    getAction() {
        return this._action;
    }
    params(params) {
        this._params = params;
        return this;
    }
    getParams() {
        return this._params;
    }
    filters(filters) {
        this._filters = filters;
        return this;
    }
    getFilters() {
        return this._filters;
    }
    fields(fields) {
        this._fields = fields;
        return this;
    }
    getFields() {
        return this._fields;
    }
}
