import { apiResources } from '../ApiResources';
import { Model } from '../Model';
import { ApiError } from './ApiError';
export class ApiAction {
    constructor() {
        this._apiActions = [];
    }
    static fromRequest(apiRequest) {
        const action = new this();
        action._action = apiRequest.getAction();
        action._params = apiRequest.getParams();
        action._filters = apiRequest.getFilters();
        action._fields = apiRequest.getFields();
        return action;
    }
    // bulk
    apiAction(apiAction) {
        this._apiActions.push(apiAction);
        return this;
    }
    get isBulk() {
        return !!this._apiActions.length;
    }
    // action
    action({ apiType = null, resourceType, actionName }) {
        const action = apiResources.getAction({ apiType, resourceType, actionName });
        if (action) {
            this._action = action;
        }
        return this;
    }
    getAction() {
        if (!this._action) {
            console.warn('ApiAction does not have an action configured.');
        }
        return this._action;
    }
    // params
    param(key, value) {
        this.params(this._params || {});
        this._params[key] = value;
        return this;
    }
    params(params) {
        this._params = params;
        return this;
    }
    // filters
    filter(name, value) {
        this.filters(this._filters || {});
        this._filters[name] = value;
        return this;
    }
    filters(filters) {
        this._filters = filters;
        return this;
    }
    getFilters() {
        return this._filters;
    }
    // fields
    field(name, value) {
        this.fields(this._fields || {});
        this._fields[name] = value;
        return this;
    }
    fields(fields) {
        this._fields = fields;
        return this;
    }
    // data
    data(data) {
        this._data = data;
        return this;
    }
    // run
    getApiRequest() {
        return this._action.createRequest()
            .params(this._params)
            .filters(this._filters)
            .fields(this._fields)
            .data(this._data);
    }
    async execute() {
        if (this.isBulk) {
            const promises = [];
            this._apiActions.forEach(a => {
                promises.push(a.execute());
            });
            this.beforeBulkRequest();
            const result = await Promise.all(promises);
            this.afterBulkRequest();
            return result;
        }
        else {
            const request = this.getApiRequest();
            await this.beforeRequest();
            const result = await request.send();
            await this.afterRequest();
            if (result instanceof ApiError) {
                this.processError(result);
                return false;
            }
            return this.processResult(result);
        }
    }
    beforeBulkRequest() {
    }
    afterBulkRequest() {
    }
    beforeRequest() {
        return Promise.resolve();
    }
    afterRequest() {
        return Promise.resolve();
    }
    processResult(result) {
        // single model
        if (result.data instanceof Model) {
            return result.data;
        }
        // list of models
        if (result.data instanceof Array) {
            return {
                models: result.data,
                meta: result.meta
            };
        }
        // single model null
        return null;
    }
    processError(_result) {
    }
}
