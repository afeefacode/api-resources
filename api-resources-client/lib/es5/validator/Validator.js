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
    createRuleValidator(rule) {
        if (rule.name === 'filled') {
            return value => {
                const filled = rule.params === true;
                // filled and value is empty
                if (filled && !this.valueIsFilled(value)) {
                    return rule.message;
                }
                return true;
            };
        }
        return () => true;
    }
    getEmptyValue(_params) {
        return null;
    }
    getMaxValueLength(_params) {
        return null;
    }
    valueIsFilled(value) {
        return !!value;
    }
}
