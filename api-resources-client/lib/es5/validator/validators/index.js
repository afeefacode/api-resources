import { DateValidator } from './DateValidator';
import { IntValidator } from './IntValidator';
import { LinkManyValidator } from './LinkManyValidator';
import { LinkOneValidator } from './LinkOneValidator';
import { NumberValidator } from './NumberValidator';
import { SetValidator } from './SetValidator';
import { StringValidator } from './StringValidator';
import { TextValidator } from './TextValidator';
export const validators = {
    'Afeefa.StringValidator': new StringValidator(),
    'Afeefa.TextValidator': new TextValidator(),
    'Afeefa.LinkOneValidator': new LinkOneValidator(),
    'Afeefa.LinkManyValidator': new LinkManyValidator(),
    'Afeefa.NumberValidator': new NumberValidator(),
    'Afeefa.IntValidator': new IntValidator(),
    'Afeefa.DateValidator': new DateValidator(),
    'Afeefa.SetValidator': new SetValidator()
};
