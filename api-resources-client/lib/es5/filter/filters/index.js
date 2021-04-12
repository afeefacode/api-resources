import { BooleanFilter } from './BooleanFilter';
import { IdFilter } from './IdFilter';
import { KeywordFilter } from './KeywordFilter';
import { OrderFilter } from './OrderFilter';
import { PageFilter } from './PageFilter';
import { TypeFilter } from './TypeFilter';
export const filters = [
    new IdFilter(),
    new TypeFilter(),
    new PageFilter(),
    new KeywordFilter(),
    new OrderFilter(),
    new BooleanFilter()
];
