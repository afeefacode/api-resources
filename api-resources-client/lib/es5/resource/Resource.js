import { Action } from '../action/Action';
export class Resource {
    constructor(json) {
        this._actions = [];
        for (const [name, actionJSON] of Object.entries(json)) {
            const action = new Action(name, actionJSON);
            this._actions.push(action);
        }
    }
}
