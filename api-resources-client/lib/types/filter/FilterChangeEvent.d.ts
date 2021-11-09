import { BagEntries } from '../bag/Bag';
import { ActionFilterValueType } from './ActionFilter';
export declare class FilterChangeEvent extends Event {
    filters: BagEntries<ActionFilterValueType>;
    constructor(type: string, filters: BagEntries<ActionFilterValueType>);
}
//# sourceMappingURL=FilterChangeEvent.d.ts.map