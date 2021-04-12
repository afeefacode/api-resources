import { BaseQuerySource, Query } from './BaseQuerySource';
export declare class ObjectQuerySource extends BaseQuerySource {
    query: Query;
    constructor(query: Query);
    getQuery(): Query;
    push(query: Query): void;
}
//# sourceMappingURL=ObjectQuerySource.d.ts.map