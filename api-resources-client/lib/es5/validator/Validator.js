import { FieldValidator } from './FieldValidator';
import { Rule } from './Rule';
import { Sanitizer } from './Sanitizer';
export class Validator {
    constructor() {
        this._rules = {};
        this._sanitizers = {};
    }
    setSanitizers(sanitizers) {
        if (sanitizers) {
            for (const [name, sanitizerJSON] of Object.entries(sanitizers)) {
                const sanitizer = new Sanitizer(name, sanitizerJSON);
                this._sanitizers[name] = sanitizer;
            }
        }
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
    getSanitizers() {
        return this._sanitizers;
    }
    getParamsWithDefaults(fieldParams) {
        const params = Object.assign({}, fieldParams);
        for (const [ruleName, rule] of Object.entries(this._rules)) {
            if (!params.hasOwnProperty(ruleName)) {
                params[ruleName] = rule.default;
            }
        }
        for (const [sanitizerName, sanitizer] of Object.entries(this._sanitizers)) {
            if (!params.hasOwnProperty(sanitizerName)) {
                params[sanitizerName] = sanitizer.default;
            }
        }
        return params;
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
    createSanitizerFunction(_sanitizer) {
        return (v) => v;
    }
    getMaxValueLength(_params) {
        return null;
    }
    valueIsFilled(value) {
        return !!value;
    }
}
