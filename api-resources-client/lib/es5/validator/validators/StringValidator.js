import { Validator } from '../Validator';
export class StringValidator extends Validator {
    createSanitizerFunction(sanitizer) {
        if (sanitizer.name === 'trim') {
            return value => {
                const trim = sanitizer.params === true;
                if (trim && typeof value === 'string') {
                    return value.trim();
                }
                return value;
            };
        }
        if (sanitizer.name === 'collapseWhite') {
            return value => {
                const collapseWhite = sanitizer.params === true;
                if (collapseWhite && typeof value === 'string') {
                    return value.replace(/(\s)+/g, '$1');
                }
                return value;
            };
        }
        if (sanitizer.name === 'emptyNull') {
            return value => {
                const emptyNull = sanitizer.params === true;
                if (emptyNull && !value) {
                    return null;
                }
                return value;
            };
        }
        return super.createSanitizerFunction(sanitizer);
    }
    createRuleValidator(rule) {
        if (rule.name === 'string') {
            return value => {
                // validate null in filled-rule
                if (value === null) {
                    return true;
                }
                if (typeof value !== 'string') {
                    return rule.message;
                }
                return true;
            };
        }
        if (rule.name === 'null') {
            return value => {
                const allowNull = rule.params === true;
                // null only allowed if set
                if (!allowNull && value === null) {
                    return rule.message;
                }
                return true;
            };
        }
        if (rule.name === 'max') {
            return value => {
                const max = rule.params ? Number(rule.params) : false;
                if (max !== false && value && value.length > max) {
                    return rule.message;
                }
                return true;
            };
        }
        if (rule.name === 'min') {
            return value => {
                const min = (rule.params || rule.params === 0) ? Number(rule.params) : false;
                if (min === false) {
                    return true;
                }
                if (typeof value === 'string' && value.length < min) {
                    return rule.message;
                }
                return true;
            };
        }
        return super.createRuleValidator(rule);
    }
    getEmptyValue(params) {
        return params.emptyNull ? null : '';
    }
    getMaxValueLength(params) {
        return params.max || null;
    }
}
