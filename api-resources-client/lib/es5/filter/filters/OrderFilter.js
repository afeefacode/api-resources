import { Filter } from '../Filter';
export class OrderFilter extends Filter {
    valueToQuery(value) {
        let query;
        if (value) {
            for (const [field, direction] of Object.entries(value)) {
                query = [field, direction].join('-'); // only 1 order possible by now
            }
        }
        return query;
    }
    queryToValue(value) {
        if (value) {
            const [field, direction] = value.split('-');
            return {
                [field]: direction
            };
        }
        return undefined;
    }
}
OrderFilter.type = 'Afeefa.OrderFilter';
