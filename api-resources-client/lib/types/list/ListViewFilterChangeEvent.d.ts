import { BagEntries } from '../bag/Bag.js';
import { ActionFilterValueType } from '../filter/ActionFilter.js';
export declare class ListViewFilterChangeEvent extends Event {
    filters: BagEntries<ActionFilterValueType>;
    constructor(type: string, filters: BagEntries<ActionFilterValueType>);
}
//# sourceMappingURL=ListViewFilterChangeEvent.d.ts.map