import { BagEntries } from '../bag/Bag';
import { Filter } from './Filter';
export declare class FilterChangeEvent extends Event {
    filters: BagEntries<Filter>;
    constructor(type: string, filters: BagEntries<Filter>);
}
//# sourceMappingURL=FilterChangeEvent.d.ts.map