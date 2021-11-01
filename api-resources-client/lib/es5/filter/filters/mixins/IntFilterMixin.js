export function IntFilterMixin(Filter) {
    return class IntFilterMixin extends Filter {
        valueToQuery(value) {
            if (value === null) {
                return '-0';
            }
            if (typeof value === 'number') {
                return Math.floor(value).toString();
            }
            return undefined;
        }
        queryToValue(query) {
            if (query === '-0') {
                return null;
            }
            const number = parseInt(query);
            if (!isNaN(number)) {
                return number;
            }
            return undefined;
        }
    };
}
