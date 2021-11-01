export function BooleanFilterMixin(Filter) {
    return class BooleanFilterMixin extends Filter {
        valueToQuery(value) {
            if (value === true) {
                return '1';
            }
            if (value === false && this.hasOption(false)) {
                return '0';
            }
            if (value === null && this.nullIsOption) {
                return '0,1';
            }
            return undefined;
        }
        queryToValue(value) {
            if (value === '1') {
                return true;
            }
            if (value === '0' && this.hasOption(false)) {
                return false;
            }
            if (value === '0,1' && this.nullIsOption) {
                return null;
            }
            return undefined;
        }
        serializeValue(value) {
            if (value) {
                return value;
            }
            if (value === false && this.hasOption(false)) {
                return false;
            }
            if (value === null && this.nullIsOption) {
                return null;
            }
            return undefined;
        }
    };
}
