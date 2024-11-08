import { Filter } from '../Filter';
export class DateFilter extends Filter {
    valueToQuery(value) {
        let query;
        if (value) {
            // sv wegen https://stackoverflow.com/a/65758103
            query = value.toLocaleDateString('sv', { year: 'numeric', month: '2-digit', day: '2-digit' });
        }
        return query;
    }
    queryToValue(value) {
        if (value) {
            return new Date(value);
        }
        return undefined;
    }
    serializeValue(value) {
        if (value) {
            value = value.toLocaleDateString('sv', { year: 'numeric', month: '2-digit', day: '2-digit' });
        }
        return value;
    }
    deserializeDefaultValue(value) {
        if (value) {
            return this.queryToValue(value);
        }
        return null;
    }
}
DateFilter.type = 'Afeefa.DateFilter';
