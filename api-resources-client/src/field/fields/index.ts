import { BooleanAttribute } from './BooleanAttribute'
import { HasManyRelation } from './HasManyRelation'
import { HasOneRelation } from './HasOneRelation'
import { IdAttribute } from './IdAttribute'
import { LinkManyRelation } from './LinkManyRelation'
import { LinkOneRelation } from './LinkOneRelation'
import { TextAttribute } from './TextAttribute'
import { VarcharAttribute } from './VarcharAttribute'

export const fields = {
  'Afeefa.VarcharAttribute': VarcharAttribute,
  'Afeefa.TextAttribute': TextAttribute,
  'Afeefa.BooleanAttribute': BooleanAttribute,
  'Afeefa.IdAttribute': IdAttribute,

  'Afeefa.HasManyRelation': HasManyRelation,
  'Afeefa.HasOneRelation': HasOneRelation,
  'Afeefa.LinkOneRelation': LinkOneRelation,
  'Afeefa.LinkManyRelation': LinkManyRelation
}
