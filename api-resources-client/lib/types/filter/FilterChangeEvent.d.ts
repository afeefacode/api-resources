import { BagEntries } from '../bag/Bag';
import { FilterValueType } from './Filter';
export declare class FilterChangeEvent extends Event {
    filters: BagEntries<FilterValueType>;
    constructor(type: string, filters: BagEntries<FilterValueType>);
}
//# sourceMappingURL=FilterChangeEvent.d.ts.map