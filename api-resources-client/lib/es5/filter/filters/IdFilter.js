import { Filter } from '../Filter';
export class IdFilter extends Filter {
    valueToQuery(value) {
        if (value) {
            return value;
        }
        return undefined;
    }
    queryToValue(value) {
        if (value) {
            return value;
        }
        return undefined;
    }
}
IdFilter.type = 'Afeefa.IdFilter';
