import { BagEntries } from '../bag/Bag';
import { ActionFilterValueType } from '../filter/ActionFilter';
export declare class ListViewFilterChangeEvent extends Event {
    filters: BagEntries<ActionFilterValueType>;
    constructor(type: string, filters: BagEntries<ActionFilterValueType>);
}
//# sourceMappingURL=ListViewFilterChangeEvent.d.ts.map