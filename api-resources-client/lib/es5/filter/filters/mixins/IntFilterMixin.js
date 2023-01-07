export function IntFilterMixin(Filter) {
    return class IntFilterMixin extends Filter {
        valueToQuery(value) {
            if (typeof value === 'number') {
                return Math.floor(value).toString();
            }
            return undefined;
        }
        queryToValue(query) {
            const number = parseInt(query);
            if (!isNaN(number)) {
                return number;
            }
            return undefined;
        }
    };
}
