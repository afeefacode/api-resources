import { BaseQuerySource, QuerySource } from './BaseQuerySource';
export declare class ObjectQuerySource extends BaseQuerySource {
    query: QuerySource;
    constructor(query: QuerySource);
    getQuery(): QuerySource;
    push(query: QuerySource): void;
}
//# sourceMappingURL=ObjectQuerySource.d.ts.map