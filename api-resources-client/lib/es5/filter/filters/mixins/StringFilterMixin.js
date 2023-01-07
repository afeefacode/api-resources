export function StringFilterMixin(Filter) {
    return class StringFilterMixin extends Filter {
        valueToQuery(value) {
            if (value) {
                return value;
            }
            return undefined;
        }
        queryToValue(query) {
            if (query) {
                return query;
            }
            return undefined;
        }
    };
}
