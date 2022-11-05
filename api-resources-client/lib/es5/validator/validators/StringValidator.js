import { Validator } from '../Validator';
export class StringValidator extends Validator {
    createRuleValidator(rule) {
        if (rule.name === 'filled') {
            return value => {
                if (rule.params === true && (!value || !value.length)) {
                    return rule.message;
                }
                return true;
            };
        }
        if (rule.name === 'max') {
            return value => {
                if (value && value.length > rule.params) {
                    return rule.message;
                }
                return true;
            };
        }
        if (rule.name === 'min') {
            return value => {
                if (!rule.getParams('filled') && (!value || !value.length)) {
                    return true;
                }
                if (value && value.length < rule.params) {
                    return rule.message;
                }
                return true;
            };
        }
        return super.createRuleValidator(rule);
    }
}
