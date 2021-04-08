import { getFilter } from '../filter/FilterRegistry';
import { ActionInput } from './ActionInput';
import { ActionParam } from './ActionParams';
import { ActionResponse } from './ActionResponse';
export class Action {
    constructor(name, json) {
        this._response = null;
        this._params = {};
        this._input = null;
        this._filters = {};
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
            for (const [name, filterJSON] of Object.entries(json.filters)) {
                const FilterClass = getFilter(filterJSON.type);
                if (FilterClass) {
                    const filter = new FilterClass(filterJSON);
                    this._filters[name] = filter;
                }
            }
        }
    }
}
