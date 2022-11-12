import { FieldValidator } from './FieldValidator';
import { Rule } from './Rule';
export class Validator {
    constructor() {
        this._rules = {};
    }
    setRules(rules) {
        if (rules) {
            for (const [name, ruleJSON] of Object.entries(rules)) {
                const rule = new Rule(name, ruleJSON);
                this._rules[name] = rule;
            }
        }
    }
    createFieldValidator(json) {
        return new FieldValidator(this, json);
    }
    getRules() {
        return this._rules;
    }
    getParamsWithDefaults(params) {
        return Object.entries(this._rules).reduce((params, [ruleName, rule]) => {
            if (!params.hasOwnProperty(ruleName)) {
                params[ruleName] = rule.default;
            }
            return params;
        }, params);
    }
    createRuleValidator(_rule) {
        return () => true;
    }
    getEmptyValue(_params) {
        return null;
    }
    getMaxValueLength(_params) {
        return null;
    }
}
