import { registerFilter } from '../FilterRegistry'
import { BooleanFilter } from './BooleanFilter'
import { IdFilter } from './IdFilter'
import { KeywordFilter } from './KeywordFilter'
import { OrderFilter } from './OrderFilter'
import { PageFilter } from './PageFilter'
import { TypeFilter } from './TypeFilter'

registerFilter('Afeefa.Id', IdFilter)
registerFilter('Afeefa.Type', TypeFilter)
registerFilter('Afeefa.Page', PageFilter)
registerFilter('Afeefa.Keyword', KeywordFilter)
registerFilter('Afeefa.Order', OrderFilter)
registerFilter('Afeefa.Boolean', BooleanFilter)
