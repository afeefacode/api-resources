import { BooleanFilter } from './BooleanFilter';
import { IdFilter } from './IdFilter';
import { KeywordFilter } from './KeywordFilter';
import { OrderFilter } from './OrderFilter';
import { PageFilter } from './PageFilter';
import { TypeFilter } from './TypeFilter';
export const filters = {
    'Afeefa.Id': IdFilter,
    'Afeefa.Type': TypeFilter,
    'Afeefa.Page': PageFilter,
    'Afeefa.Keyword': KeywordFilter,
    'Afeefa.Order': OrderFilter,
    'Afeefa.Boolean': BooleanFilter
};
