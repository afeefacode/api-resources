import { Filter } from '../Filter';
export class OrderFilter extends Filter {
    valueToQuery(value) {
        let query;
        if (value) {
            for (const [field, direction] of Object.entries(value)) {
                query = [field, direction].join('-');
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
    serializeValue(value) {
        if (value) {
            return value;
        }
        return undefined;
    }
}
OrderFilter.type = 'Afeefa.OrderFilter';
