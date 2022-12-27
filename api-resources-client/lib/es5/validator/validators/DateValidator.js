import { Validator } from '../Validator';
export class DateValidator extends Validator {
    createRuleValidator(rule) {
        if (rule.name === 'date') {
            return value => {
                // validate null in filled-rule
                if (value === null) {
                    return true;
                }
                // not a date
                if (!(value instanceof Date)) {
                    return rule.message;
                }
                return true;
            };
        }
        return super.createRuleValidator(rule);
    }
}
