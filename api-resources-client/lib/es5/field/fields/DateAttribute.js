import { Attribute } from '../Attribute';
export class DateAttribute extends Attribute {
    deserialize(value) {
        return new Date(value);
    }
    serialize(value) {
        return value;
    }
}
DateAttribute.type = 'Afeefa.DateAttribute';
