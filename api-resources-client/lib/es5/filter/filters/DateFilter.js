import { Filter } from '../Filter';
export class DateFilter extends Filter {
    valueToQuery(value) {
        let query;
        if (value) {
            query = value.toISOString();
        }
        return query;
    }
    queryToValue(value) {
        if (value) {
            return new Date(value);
        }
        return undefined;
    }
    deserializeDefaultValue(value) {
        if (value) {
            return this.queryToValue(value);
        }
        return null;
    }
}
DateFilter.type = 'Afeefa.DateFilter';
