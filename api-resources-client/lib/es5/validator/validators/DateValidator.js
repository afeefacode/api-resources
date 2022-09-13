import { Validator } from '../Validator';
export class DateValidator extends Validator {
    createRuleValidator(fieldLabel, ruleName, rule, params) {
        // if (ruleName === 'date') {
        //   return value => {
        //     if (value && !(value instanceof Date)) {
        //       return rule.getMessage(fieldLabel, params)
        //     }
        //     return true
        //   }
        // }
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
