import { Filter } from '../Filter';
export class OrderFilter extends Filter {
    constructor() {
        super(...arguments);
        this.fields = {};
    }
    setupParams(json) {
        if (json.fields) {
            for (const [name, orderJSON] of Object.entries(json.fields)) {
                this.fields[name] = orderJSON;
            }
        }
    }
}
