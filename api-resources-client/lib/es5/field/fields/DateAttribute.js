import { Attribute } from '../Attribute';
export class DateAttribute extends Attribute {
    deserialize(value) {
        if (value) {
            return new Date(value);
        }
        return null;
    }
}
DateAttribute.type = 'Afeefa.DateAttribute';
