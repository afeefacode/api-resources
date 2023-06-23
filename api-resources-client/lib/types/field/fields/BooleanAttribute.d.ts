import { Attribute } from '../Attribute';
import { FieldValue } from '../Field';
export declare class BooleanAttribute extends Attribute {
    static type: string;
    protected fallbackDefault(): FieldValue;
    deserialize(value: unknown): boolean;
}
//# sourceMappingURL=BooleanAttribute.d.ts.map