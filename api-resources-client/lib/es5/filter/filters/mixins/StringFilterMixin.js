export function StringFilterMixin(Filter) {
    return class StringFilterMixin extends Filter {
        valueToQuery(value) {
            if (value) {
                return value;
            }
            if (value === null) {
                return '---';
            }
            return undefined;
        }
        queryToValue(query) {
            if (query) {
                return query;
            }
            if (query === '---') {
                return null;
            }
            return undefined;
        }
    };
}
