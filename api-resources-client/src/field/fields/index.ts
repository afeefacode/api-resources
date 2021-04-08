import { registerField } from '../FieldRegistry'
import { BooleanAttribute } from './BooleanAttribute'
import { HasManyRelation } from './HasManyRelation'
import { HasOneRelation } from './HasOneRelation'
import { IdAttribute } from './IdAttribute'
import { LinkManyRelation } from './LinkManyRelation'
import { LinkOneRelation } from './LinkOneRelation'
import { TextAttribute } from './TextAttribute'
import { VarcharAttribute } from './VarcharAttribute'

registerField('Afeefa.VarcharAttribute', VarcharAttribute)
registerField('Afeefa.TextAttribute', TextAttribute)
registerField('Afeefa.BooleanAttribute', BooleanAttribute)
registerField('Afeefa.IdAttribute', IdAttribute)

registerField('Afeefa.HasManyRelation', HasManyRelation)
registerField('Afeefa.HasOneRelation', HasOneRelation)
registerField('Afeefa.LinkOneRelation', LinkOneRelation)
registerField('Afeefa.LinkManyRelation', LinkManyRelation)
