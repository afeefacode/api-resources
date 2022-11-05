import { Validator } from '../Validator';
export class DateValidator extends Validator {
    createRuleValidator(rule) {
        if (rule.name === 'date') {
            return value => {
                if (value !== null && !(value instanceof Date)) { // validate null later
                    return rule.message;
                }
                return true;
            };
        }
        if (rule.name === 'null') {
            return value => {
                if (rule.params === true && !value && value !== null) {
                    return rule.message;
                }
                return true;
            };
        }
        if (rule.name === 'filled') {
            return value => {
                if (rule.params === true && !value) {
                    return rule.message;
                }
                return true;
            };
        }
        return super.createRuleValidator(rule);
    }
}
