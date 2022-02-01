import { Attribute } from '../Attribute';
export class StringAttribute extends Attribute {
    fallbackDefault() {
        return '';
    }
}
StringAttribute.type = 'Afeefa.StringAttribute';
