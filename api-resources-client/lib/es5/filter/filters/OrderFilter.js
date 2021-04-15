import { Filter } from '../Filter';
export class OrderFilter extends Filter {
    valueToQuery(value) {
        if (value) {
            return value.join('-');
        }
        return undefined;
    }
    queryToValue(value) {
        if (value) {
            return value.split('-');
        }
        return undefined;
    }
}
OrderFilter.type = 'Afeefa.OrderFilter';
