import { Filter } from '../Filter';
export class BooleanFilter extends Filter {
    constructor(json) {
        super(json);
        this.values = json.values;
    }
}
