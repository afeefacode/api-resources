import { BagEntries } from '../bag/Bag.js';
import { ListViewFilterSource } from './ListViewFilterSource.js';
export declare class ObjectFilterSource extends ListViewFilterSource {
    query: BagEntries<string>;
    constructor(query: BagEntries<string>);
    getQuery(): BagEntries<string>;
    push(query: BagEntries<string>): void;
}
//# sourceMappingURL=ObjectFilterSource.d.ts.map