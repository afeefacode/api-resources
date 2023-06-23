import { Attribute } from '../Attribute';
export class BooleanAttribute extends Attribute {
    fallbackDefault() {
        return false;
    }
    deserialize(value) {
        return !!value;
    }
}
BooleanAttribute.type = 'Afeefa.BooleanAttribute';
