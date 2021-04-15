import { BaseFilterValue, FilterValuesType } from './BaseFilterValue';
export declare class MultiFilterValue extends BaseFilterValue {
    private _values;
    get value(): FilterValuesType;
    deserialize(json: object): void;
    serialize(): FilterValuesType;
    reset(defaultValue: MultiFilterValue): void;
    valueChanged(): void;
}
//# sourceMappingURL=MultiFilterValue.d.ts.map