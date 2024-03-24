import { Validator } from '../Validator';
export class LinkManyValidator extends Validator {
    createRuleValidator(rule) {
        if (rule.name === 'filled') {
            return value => {
                if (rule.params === true && !value.length) {
                    return rule.message;
                }
                return true;
            };
        }
        if (rule.name === 'max') {
            return value => {
                const max = rule.params ? Number(rule.params) : false;
                if (max === false) {
                    return true;
                }
                // empty value cannot exceed max
                if (!value.length) {
                    return true;
                }
                if (value.length > max) {
                    return rule.message;
                }
                return true;
            };
        }
        return super.createRuleValidator(rule);
    }
}
