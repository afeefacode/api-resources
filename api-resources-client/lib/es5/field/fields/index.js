import { BooleanAttribute } from './BooleanAttribute';
import { DateAttribute } from './DateAttribute';
import { EnumAttribute } from './EnumAttribute';
import { HasManyRelation } from './HasManyRelation';
import { HasOneRelation } from './HasOneRelation';
import { IdAttribute } from './IdAttribute';
import { IntAttribute } from './IntAttribute';
import { LinkManyRelation } from './LinkManyRelation';
import { LinkOneRelation } from './LinkOneRelation';
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
    new HasManyRelation(),
    new HasOneRelation(),
    new LinkOneRelation(),
    new LinkManyRelation()
];
