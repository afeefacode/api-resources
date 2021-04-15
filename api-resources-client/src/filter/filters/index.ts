import { BooleanFilter } from './BooleanFilter'
import { IdFilter } from './IdFilter'
import { KeywordFilter } from './KeywordFilter'
import { OrderFilter } from './OrderFilter'
import { PageFilter } from './PageFilter'
import { PageSizeFilter } from './PageSizeFilter'
import { SelectFilter } from './SelectFilter'
import { TypeFilter } from './TypeFilter'

export const filters = [
  new IdFilter(),
  new TypeFilter(),
  new PageFilter(),
  new PageSizeFilter(),
  new KeywordFilter(),
  new OrderFilter(),
  new BooleanFilter(),
  new SelectFilter()
]
