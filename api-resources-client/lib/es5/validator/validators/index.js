import { DateValidator } from './DateValidator';
import { IntValidator } from './IntValidator';
import { LinkOneValidator } from './LinkOneValidator';
import { NumberValidator } from './NumberValidator';
import { StringValidator } from './StringValidator';
export const validators = {
    'Afeefa.StringValidator': new StringValidator(),
    'Afeefa.LinkOneValidator': new LinkOneValidator(),
    'Afeefa.NumberValidator': new NumberValidator(),
    'Afeefa.IntValidator': new IntValidator(),
    'Afeefa.DateValidator': new DateValidator()
};
