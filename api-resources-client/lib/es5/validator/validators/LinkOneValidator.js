import { Validator } from '../Validator';
export class LinkOneValidator extends Validator {
    createRuleValidator(ruleName, rule, params) {
        if (ruleName === 'filled') {
            return value => {
                if (params === true && !value) {
                    return rule.getMessage(this._fieldName, params);
                }
                return true;
            };
        }
        return super.createRuleValidator(ruleName, rule, params);
    }
}
