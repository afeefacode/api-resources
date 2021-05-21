import { Validator } from '../Validator';
export class VarcharValidator extends Validator {
    createRuleValidator(ruleName, rule, params) {
        if (ruleName === 'filled') {
            return value => {
                if (params === true && !value.length) {
                    return rule.getMessage(this._fieldName, params);
                }
                return true;
            };
        }
        if (ruleName === 'max') {
            return value => {
                if (value.length > params) {
                    return rule.getMessage(this._fieldName, params);
                }
                return true;
            };
        }
        if (ruleName === 'min') {
            return value => {
                if (!this._params.filled && !value.length) {
                    return true;
                }
                if (value.length < params) {
                    return rule.getMessage(this._fieldName, params);
                }
                return true;
            };
        }
        return super.createRuleValidator(ruleName, rule, params);
    }
}
