import { Relation } from '../Relation';
import { BooleanAttribute } from './BooleanAttribute';
import { DateAttribute } from './DateAttribute';
import { EnumAttribute } from './EnumAttribute';
import { IdAttribute } from './IdAttribute';
import { IntAttribute } from './IntAttribute';
import { NumberAttribute } from './NumberAttribute';
import { TextAttribute } from './TextAttribute';
import { VarcharAttribute } from './VarcharAttribute';
export const fields = [
    new VarcharAttribute(),
    new TextAttribute(),
    new BooleanAttribute(),
    new IdAttribute(),
    new DateAttribute(),
    new IntAttribute(),
    new NumberAttribute(),
    new EnumAttribute(),
    new Relation()
];
