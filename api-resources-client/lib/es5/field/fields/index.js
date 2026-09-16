import { Relation } from '../Relation.js';
import { BooleanAttribute } from './BooleanAttribute.js';
import { DateAttribute } from './DateAttribute.js';
import { EnumAttribute } from './EnumAttribute.js';
import { IdAttribute } from './IdAttribute.js';
import { IntAttribute } from './IntAttribute.js';
import { NumberAttribute } from './NumberAttribute.js';
import { SetAttribute } from './SetAttribute.js';
import { StringAttribute } from './StringAttribute.js';
export const fields = [
    new StringAttribute(),
    new BooleanAttribute(),
    new IdAttribute(),
    new DateAttribute(),
    new IntAttribute(),
    new NumberAttribute(),
    new EnumAttribute(),
    new SetAttribute(),
    new Relation()
];
