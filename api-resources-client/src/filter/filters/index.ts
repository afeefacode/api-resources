import { DateFilter } from './DateFilter.js'
import { KeywordFilter } from './KeywordFilter.js'
import { OrderFilter } from './OrderFilter.js'
import { PageFilter } from './PageFilter.js'
import { PageSizeFilter } from './PageSizeFilter.js'
import { PolarizedSelectFilter } from './PolarizedSelectFilter.js'
import { SelectFilter } from './SelectFilter.js'

export const filters = [
  new PageFilter(),
  new PageSizeFilter(),
  new KeywordFilter(),
  new OrderFilter(),
  new SelectFilter(),
  new PolarizedSelectFilter(),
  new DateFilter()
]
