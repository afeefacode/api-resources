import { ApiRequest } from '../api/ApiRequest';
import { BatchApiRequest } from '../api/BatchApiRequest';
import { apiResources } from '../ApiResources';
import { ActionFilterBag } from '../filter/ActionFilterBag';
import { ActionInput } from './ActionInput';
import { ActionParam } from './ActionParams';
import { ActionResponse } from './ActionResponse';
export class Action {
    constructor(resource, name, json) {
        this._response = null;
        this._params = {};
        this._input = null;
        this._filters = new ActionFilterBag();
        this._resource = resource;
        this._name = name;
        if (json.response) {
            this._response = new ActionResponse(json.response.type);
        }
        if (json.input) {
            this._input = new ActionInput(json.input.type);
        }
        if (json.params) {
            for (const [name, paramJSON] of Object.entries(json.params)) {
                const param = new ActionParam(paramJSON);
                this._params[name] = param;
            }
        }
        if (json.filters) {
            for (const [name, actionFilterJSON] of Object.entries(json.filters)) {
                const filter = apiResources.getFilter(actionFilterJSON.type);
                if (filter) {
                    const actionFilter = filter.createActionFilter(this, name, actionFilterJSON);
                    this._filters.add(name, actionFilter);
                }
            }
        }
    }
    getName() {
        return this._name;
    }
    getFullName() {
        return this.getResource().getType() + '.' + this._name;
    }
    getResponse() {
        return this._response;
    }
    getInput() {
        return this._input;
    }
    getFilters() {
        return this._filters;
    }
    createRequest() {
        return new ApiRequest()
            .action(this);
    }
    batchRequest() {
        return new BatchApiRequest()
            .action(this);
    }
    getResource() {
        return this._resource;
    }
    getApi() {
        return this._resource.getApi();
    }
}
