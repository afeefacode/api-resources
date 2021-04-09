import { Rule } from './Rule';
export class Validator {
    constructor() {
        this._rules = {};
        this._params = {};
    }
    setupRules(rules) {
        if (rules) {
            for (const [name, ruleJSON] of Object.entries(rules)) {
                const rule = new Rule(ruleJSON);
                this._rules[name] = rule;
            }
        }
    }
    createFieldValidator(json) {
        const validator = new this.constructor();
        validator._rules = this._rules;
        validator.setupParams(json.params);
        return validator;
    }
    setupParams(params) {
        if (params) {
            for (const [name, paramJSON] of Object.entries(params)) {
                this._params[name] = paramJSON;
            }
        }
    }
}
