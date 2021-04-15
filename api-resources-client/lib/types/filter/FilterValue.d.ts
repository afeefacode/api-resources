import { BaseFilterValue, FilterValueType } from './BaseFilterValue';
export declare class FilterValue extends BaseFilterValue {
    private _value;
    private _valueInitialized;
    get value(): FilterValueType;
    set value(value: FilterValueType);
    deserialize(json: object): void;
    serialize(): FilterValueType;
    reset(defaultValue: BaseFilterValue): void;
    valueChanged(): void;
}
//# sourceMappingURL=FilterValue.d.ts.map