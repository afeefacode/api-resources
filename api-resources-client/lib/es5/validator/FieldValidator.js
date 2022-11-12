import { FieldRule } from './FieldRule';
export class FieldValidator {
    constructor(validator, json) {
        this._params = {};
        this._additionalRules = [];
        this._validator = validator;
        for (const [ruleName, paramJSON] of Object.entries(json.params)) {
            this._params[ruleName] = paramJSON;
        }
    }
    getParams() {
        return this._params;
    }
    param(ruleName) {
        return this._params[ruleName];
    }
    getRules(fieldLabel) {
        const rules = this._validator.getRules();
        return [
            ...Object.keys(rules).map(ruleName => {
                const rule = rules[ruleName];
                return this.createRuleValidator(new FieldRule(rule, this._params, fieldLabel));
            }),
            ...this._additionalRules
        ];
    }
    addAdditionalRule(rule) {
        this._additionalRules.push(rule);
        return this;
    }
    setAdditionalRules(rules) {
        this._additionalRules = rules;
        return this;
    }
    getEmptyValue() {
        const params = this._validator.getParamsWithDefaults(this._params);
        return this._validator.getEmptyValue(params);
    }
    getMaxValueLength() {
        const params = this._validator.getParamsWithDefaults(this._params);
        return this._validator.getMaxValueLength(params);
    }
    createRuleValidator(rule) {
        return this._validator.createRuleValidator(rule);
    }
}
