import { ActionFilterValueType } from '../ActionFilter';
import { Filter } from '../Filter';
export declare class DateFilter extends Filter {
    static type: string;
    valueToQuery(value: Date | null): string | undefined;
    queryToValue(value: string): Date | undefined;
    serializeValue(value: ActionFilterValueType): ActionFilterValueType;
    deserializeDefaultValue(value: ActionFilterValueType): ActionFilterValueType;
}
//# sourceMappingURL=DateFilter.d.ts.map