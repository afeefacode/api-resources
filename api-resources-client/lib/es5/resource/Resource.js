import { Action } from '../action/Action';
export class Resource {
    constructor(api, name, json) {
        this._actions = {};
        this._api = api;
        this._type = name;
        for (const [name, actionJSON] of Object.entries(json)) {
            const action = new Action(this, name, actionJSON);
            this._actions[name] = action;
        }
    }
    getApi() {
        return this._api;
    }
    getType() {
        return this._type;
    }
    getAction(name) {
        if (!this._actions[name]) {
            console.warn(`No action '${name}' configured for resource '${this._type}'.`);
            return null;
        }
        return this._actions[name];
    }
}
