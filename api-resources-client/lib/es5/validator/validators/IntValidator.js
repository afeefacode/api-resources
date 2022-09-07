import { Validator } from '../Validator';
export class IntValidator extends Validator {
    createRuleValidator(fieldLabel, ruleName, rule, params) {
        if (ruleName === 'number') {
            return value => {
                if (isNaN(Number(value)) || Number(value) !== parseInt(String(value))) {
                    return rule.getMessage(fieldLabel, params);
                }
                return true;
            };
        }
        if (ruleName === 'filled') {
            return value => {
                value = Number(value);
                if (params === true && !value) {
                    return rule.getMessage(fieldLabel, params);
                }
                return true;
            };
        }
        if (ruleName === 'min') {
            return value => {
                value = Number(value);
                if (!this._params.filled && !value) {
                    return true;
                }
                if (value < params) {
                    return rule.getMessage(fieldLabel, params);
                }
                return true;
            };
        }
        if (ruleName === 'max') {
            return value => {
                value = Number(value);
                if (value > params) {
                    return rule.getMessage(fieldLabel, params);
                }
                return true;
            };
        }
        return super.createRuleValidator(fieldLabel, ruleName, rule, params);
    }
}
