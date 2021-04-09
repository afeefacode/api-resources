import { BooleanAttribute } from './BooleanAttribute'
import { HasManyRelation } from './HasManyRelation'
import { HasOneRelation } from './HasOneRelation'
import { IdAttribute } from './IdAttribute'
import { LinkManyRelation } from './LinkManyRelation'
import { LinkOneRelation } from './LinkOneRelation'
import { TextAttribute } from './TextAttribute'
import { VarcharAttribute } from './VarcharAttribute'

export const fields = {
  'Afeefa.VarcharAttribute': new VarcharAttribute(),
  'Afeefa.TextAttribute': new TextAttribute(),
  'Afeefa.BooleanAttribute': new BooleanAttribute(),
  'Afeefa.IdAttribute': new IdAttribute(),

  'Afeefa.HasManyRelation': new HasManyRelation(),
  'Afeefa.HasOneRelation': new HasOneRelation(),
  'Afeefa.LinkOneRelation': new LinkOneRelation(),
  'Afeefa.LinkManyRelation': new LinkManyRelation()
}
