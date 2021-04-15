export function IntFilter(Filter) {
    return class IntFilter extends Filter {
        valueToQuery(value) {
            if (value || value === 0) {
                return value.toString();
            }
            return undefined;
        }
        queryToValue(value) {
            if (value || value === '0') {
                return parseInt(value);
            }
            return undefined;
        }
    };
}
