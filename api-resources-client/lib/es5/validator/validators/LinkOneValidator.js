import { Validator } from '../Validator';
export class LinkOneValidator extends Validator {
    createRuleValidator(fieldLabel, ruleName, rule, params) {
        if (ruleName === 'filled') {
            return value => {
                if (params === true && !value) {
                    return rule.getMessage(fieldLabel, params);
                }
                return true;
            };
        }
        return super.createRuleValidator(fieldLabel, ruleName, rule, params);
    }
}
