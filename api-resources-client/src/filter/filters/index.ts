import { DateFilter } from './DateFilter'
import { KeywordFilter } from './KeywordFilter'
import { OrderFilter } from './OrderFilter'
import { PageFilter } from './PageFilter'
import { PageSizeFilter } from './PageSizeFilter'
import { SelectFilter } from './SelectFilter'

export const filters = [
  new PageFilter(),
  new PageSizeFilter(),
  new KeywordFilter(),
  new OrderFilter(),
  new SelectFilter(),
  new DateFilter()
]
