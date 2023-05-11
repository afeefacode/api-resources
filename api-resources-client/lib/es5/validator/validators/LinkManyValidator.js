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
        return super.createRuleValidator(rule);
    }
}
