export function BooleanFilterMixin(Filter) {
    return class BooleanFilterMixin extends Filter {
        valueToQuery(value) {
            if (value === true) {
                return '1';
            }
            if (value === false) {
                return '0';
            }
            if (value === null) {
                return '0,1';
            }
            return undefined;
        }
        queryToValue(query) {
            if (query === '1') {
                return true;
            }
            if (query === '0') {
                return false;
            }
            if (query === '0,1') {
                return null;
            }
            return undefined;
        }
    };
}
