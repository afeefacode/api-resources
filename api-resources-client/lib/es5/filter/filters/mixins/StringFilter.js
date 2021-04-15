export function StringFilter(Filter) {
    return class StringFilter extends Filter {
        valueToQuery(value) {
            if (value || value === '') {
                return value;
            }
            return undefined;
        }
        queryToValue(value) {
            if (value || value === '') {
                return value;
            }
            return undefined;
        }
    };
}
