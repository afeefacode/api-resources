import { Validator } from '../Validator';
export class VarcharValidator extends Validator {
    createRuleValidator(ruleName, rule, params, fieldName) {
        if (ruleName === 'max') {
            return (value) => {
                if (value.length > params) {
                    return rule.getMessage(fieldName, params);
                }
                return true;
            };
        }
        if (ruleName === 'min') {
            return (value) => {
                if (value.length < params) {
                    return rule.getMessage(fieldName, params);
                }
                return true;
            };
        }
        return super.createRuleValidator(ruleName, rule, params, fieldName);
    }
}
