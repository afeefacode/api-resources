import { BooleanFilter } from './BooleanFilter';
import { IdFilter } from './IdFilter';
import { KeywordFilter } from './KeywordFilter';
import { OrderFilter } from './OrderFilter';
import { PageFilter } from './PageFilter';
import { TypeFilter } from './TypeFilter';
export const filters = {
    'Afeefa.Id': new IdFilter(),
    'Afeefa.Type': new TypeFilter(),
    'Afeefa.Page': new PageFilter(),
    'Afeefa.Keyword': new KeywordFilter(),
    'Afeefa.Order': new OrderFilter(),
    'Afeefa.Boolean': new BooleanFilter()
};
