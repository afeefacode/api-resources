import { Filter } from '../Filter';
export class OrderFilter extends Filter {
    constructor(json) {
        super(json);
        for (const [name, orderJSON] of Object.entries(json)) {
            this[name] = orderJSON;
        }
    }
}
