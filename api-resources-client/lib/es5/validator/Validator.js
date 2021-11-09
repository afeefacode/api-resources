import { FieldValidator } from './FieldValidator';
import { Rule } from './Rule';
export class Validator {
    constructor() {
        this._rules = {};
        this._params = {};
    }
    setRules(rules) {
        if (rules) {
            for (const [name, ruleJSON] of Object.entries(rules)) {
                const rule = new Rule(ruleJSON);
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
    createRuleValidator(_fieldLabel, _ruleName, _rule, _params) {
        return () => true;
    }
}
