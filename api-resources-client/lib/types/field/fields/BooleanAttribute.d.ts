import { Attribute } from '../Attribute.js';
import { FieldValue } from '../Field.js';
export declare class BooleanAttribute extends Attribute {
    static type: string;
    protected fallbackDefault(): FieldValue;
    deserialize(value: unknown): boolean;
}
//# sourceMappingURL=BooleanAttribute.d.ts.map