import { Bag } from '../bag/Bag';
export class ListViewFilterBag extends Bag {
    serialize() {
        const filters = {};
        for (const [name, filter] of this.entries()) {
            const value = filter.serialize();
            if (value !== undefined) {
                filters[name] = value;
            }
        }
        return filters;
    }
    toActionFilterValueBag() {
        const filters = {};
        for (const [name, filter] of this.entries()) {
            const value = filter.value;
            if (value !== undefined) {
                filters[name] = value;
            }
        }
        return filters;
    }
}
