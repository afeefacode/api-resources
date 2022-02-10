import { Attribute } from '../Attribute';
export class BooleanAttribute extends Attribute {
    fallbackDefault() {
        return false;
    }
}
BooleanAttribute.type = 'Afeefa.BooleanAttribute';
