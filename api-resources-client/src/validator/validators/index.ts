import { LinkOneValidator } from './LinkOneValidator'
import { SelectValidator } from './SelectValidator'
import { VarcharValidator } from './VarcharValidator'

export const validators = {
  'Afeefa.VarcharValidator': new VarcharValidator(),
  'Afeefa.LinkOneValidator': new LinkOneValidator(),
  'Afeefa.SelectValidator': new SelectValidator()
}
