import { BagEntries } from '../bag/Bag';
import { BaseFilterSource } from './BaseFilterSource';
export declare class ObjectFilterSource extends BaseFilterSource {
    query: BagEntries<string>;
    constructor(query: BagEntries<string>);
    getQuery(): BagEntries<string>;
    push(query: BagEntries<string>): void;
}
//# sourceMappingURL=ObjectFilterSource.d.ts.map