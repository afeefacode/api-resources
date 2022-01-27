import { LinkOneValidator } from './LinkOneValidator';
import { SelectValidator } from './SelectValidator';
import { StringValidator } from './StringValidator';
export const validators = {
    'Afeefa.StringValidator': new StringValidator(),
    'Afeefa.LinkOneValidator': new LinkOneValidator(),
    'Afeefa.SelectValidator': new SelectValidator()
};
