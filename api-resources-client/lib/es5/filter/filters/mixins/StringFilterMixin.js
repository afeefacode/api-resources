export function StringFilterMixin(Filter) {
    return class StringFilterMixin extends Filter {
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
