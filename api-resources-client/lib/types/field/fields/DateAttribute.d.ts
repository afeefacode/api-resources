import { Attribute } from '../Attribute';
import { FieldJSONValue, FieldValue } from '../Field';
export declare class DateAttribute extends Attribute {
    static type: string;
    deserialize(value: string | null): Date | null;
    serialize(value: FieldValue): FieldJSONValue;
}
//# sourceMappingURL=DateAttribute.d.ts.map