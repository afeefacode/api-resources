import { Filter } from '../Filter';
export class BooleanFilter extends Filter {
    setupParams(json) {
        this.values = json.values;
    }
}
