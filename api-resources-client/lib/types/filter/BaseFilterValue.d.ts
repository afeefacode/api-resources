import { QuerySource } from './BaseQuerySource';
import { Filter } from './Filter';
export declare type FilterValueType = boolean | string | number | [string, FilterValueType] | null;
export declare type FilterValuesType = Record<string, FilterValueType>;
export declare type FilterValueTypes = FilterValueType | FilterValuesType;
export declare class BaseFilterValue {
    protected filter: Filter;
    constructor(filter: Filter);
    get value(): FilterValueTypes;
    set value(_value: FilterValueTypes);
    toString(): string;
    fromQuerySource(_query: QuerySource): void;
    toQuerySource(): QuerySource;
    deserialize(_json: object): void;
    serialize(): FilterValueTypes;
    reset(_defaultValue: BaseFilterValue): void;
    valueChanged(): void;
}
//# sourceMappingURL=BaseFilterValue.d.ts.map