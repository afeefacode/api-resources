import { Validator } from '../Validator';
export class NumberValidator extends Validator {
    createRuleValidator(rule) {
        if (rule.name === 'number') {
            return value => {
                if (!rule.getParams('filled') && !value) { // no value but not forced to be filled -> ok
                    return true;
                }
                if (isNaN(Number(value))) {
                    return rule.message;
                }
                return true;
            };
        }
        if (rule.name === 'filled') {
            return value => {
                value = Number(value);
                if (rule.params === true && !value) {
                    return rule.message;
                }
                return true;
            };
        }
        if (rule.name === 'min') {
            return value => {
                value = Number(value);
                if (!rule.getParams('filled') && !value) {
                    return true;
                }
                if (value < rule.params) {
                    return rule.message;
                }
                return true;
            };
        }
        if (rule.name === 'max') {
            return value => {
                value = Number(value);
                if (value > rule.params) {
                    return rule.message;
                }
                return true;
            };
        }
        return super.createRuleValidator(rule);
    }
}
