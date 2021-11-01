export function BooleanFilterMixin(Filter) {
    return class BooleanFilterMixin extends Filter {
        valueToQuery(value) {
            if (value === true) {
                return '1';
            }
            if (value === false && this.options.includes(false)) {
                return '0';
            }
            if (value === null && this.hasNullAsOption) {
                return '0,1';
            }
            return undefined;
        }
        queryToValue(value) {
            if (value === '1') {
                return true;
            }
            if (value === '0' && this.options.includes(false)) {
                return false;
            }
            if (value === '0,1' && this.hasNullAsOption) {
                return null;
            }
            return undefined;
        }
        serializeValue(value) {
            if (value) {
                return value;
            }
            if (value === false && this.options.includes(false)) {
                return false;
            }
            if (value === null && this.hasNullAsOption) {
                return null;
            }
            return undefined;
        }
    };
}
