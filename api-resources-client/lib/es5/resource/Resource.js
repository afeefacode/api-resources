import { Action } from '../action/Action';
export class Resource {
    constructor(api, name, json) {
        this._actions = {};
        this._api = api;
        this._name = name;
        for (const [name, actionJSON] of Object.entries(json)) {
            const action = new Action(this, name, actionJSON);
            this._actions[name] = action;
        }
    }
    getApi() {
        return this._api;
    }
    getName() {
        return this._name;
    }
    getAction(name) {
        return this._actions[name] || null;
    }
}
