export class FieldValidator {
    constructor(validator, json) {
        this._params = {};
        this._validator = validator;
        for (const [name, paramJSON] of Object.entries(json.params)) {
            this._params[name] = paramJSON;
        }
    }
    getParams() {
        return this._params;
    }
    param(name) {
        return this._params[name];
    }
    getRules(fieldLabel) {
        const rules = this._validator.getRules();
        return Object.keys(rules).map(name => {
            return this.createRuleValidator(fieldLabel, name, rules[name], this._params[name]);
        });
    }
    createRuleValidator(fieldLabel, ruleName, rule, params) {
        return this._validator.createRuleValidator(fieldLabel, ruleName, rule, params);
    }
}
