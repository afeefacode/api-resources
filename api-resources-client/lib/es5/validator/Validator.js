import { Rule } from './Rule';
export class Validator {
    constructor() {
        this._rules = {};
        this._params = {};
    }
    setup(json) {
        if (json.rules) {
            for (const [name, ruleJSON] of Object.entries(json.rules)) {
                const rule = new Rule(ruleJSON);
                this._rules[name] = rule;
            }
        }
    }
    createInstance(json) {
        const validator = new this.constructor();
        validator._rules = this._rules;
        if (json.params) {
            for (const [name, paramJSON] of Object.entries(json.params)) {
                validator._params[name] = paramJSON;
            }
        }
        return validator;
    }
}
