import { BaseFilterSource, QuerySource } from './BaseFilterSource';
export declare class ObjectFilterSource extends BaseFilterSource {
    query: QuerySource;
    constructor(query: QuerySource);
    getQuery(): QuerySource;
    push(query: QuerySource): void;
}
//# sourceMappingURL=ObjectFilterSource.d.ts.map