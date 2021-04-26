import { Attribute } from '../Attribute';
import { FieldJSONValue, FieldValue } from '../Field';
export declare class DateAttribute extends Attribute {
    static type: string;
    deserialize(value: string): Date;
    serialize(value: FieldValue): FieldJSONValue;
}
//# sourceMappingURL=DateAttribute.d.ts.map