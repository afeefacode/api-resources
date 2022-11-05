import { Validator } from '../Validator';
export class LinkOneValidator extends Validator {
    createRuleValidator(rule) {
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
