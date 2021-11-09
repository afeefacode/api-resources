import { BagEntries } from '../bag/Bag';
import { ListViewFilterSource } from './ListViewFilterSource';
export declare class ObjectFilterSource extends ListViewFilterSource {
    query: BagEntries<string>;
    constructor(query: BagEntries<string>);
    getQuery(): BagEntries<string>;
    push(query: BagEntries<string>): void;
}
//# sourceMappingURL=ObjectFilterSource.d.ts.map