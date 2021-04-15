export function BooleanFilter(Filter) {
    return class BooleanFilter extends Filter {
        valueToQuery(value) {
            if (value === true) {
                return 'true';
            }
            if (value === false) {
                return 'false';
            }
            return undefined;
        }
        queryToValue(value) {
            if (value === 'true') {
                return true;
            }
            if (value === 'false') {
                return false;
            }
            return undefined;
        }
    };
}
